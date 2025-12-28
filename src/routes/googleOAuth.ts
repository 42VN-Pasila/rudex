import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import { SQLUserRepo } from "@repository/implementations/sqlUserRepo";
import { LoginGoogleUserUseCase } from "@useCases/loginGoogleUser/loginGoogleUserUseCase";

function makeOauthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  // ✅ Vì OAuth code flow cần client_secret để đổi code -> token
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI");
  }

  // ✅ OAuth2Client sẽ giúp generate URL + exchange code -> token
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export default async function googleOAuthRoutes(app: FastifyInstance) {
  const userRepo = new SQLUserRepo();
  const loginGoogleUserUseCase = new LoginGoogleUserUseCase(userRepo);

  /**
   * 1) GET /auth/google
   * - Tạo state (chống CSRF)
   * - Lưu state vào cookie (để callback so sánh)
   * - Redirect user sang Google
   */
  app.get("/auth/google", async (_req, reply) => {
    const oauth2 = makeOauthClient();

    // ✅ state là “vé gửi xe”, lát quay về phải đúng vé mới nhận
    const state = crypto.randomUUID();

    // ✅ Lưu state trong cookie để không phụ thuộc RAM server (tránh invalid_state khi reload)
    reply.setCookie("oauth_state", state, {
      httpOnly: true, // JS trên FE không đọc được => an toàn hơn
      sameSite: "lax", // cho phép cookie đi kèm khi Google redirect về callback
      secure: process.env.NODE_ENV === "production", // prod phải https
      path: "/auth/google/callback", // cookie chỉ gửi cho callback
      signed: true, // cookie có chữ ký, user sửa sẽ bị phát hiện
      maxAge: 5 * 60, // 5 phút là đủ cho 1 lần login
    });

    // ✅ URL để Google hiện trang chọn email + xin quyền
    const url = oauth2.generateAuthUrl({
      scope: ["openid", "email", "profile"], // openid để có id_token
      access_type: "offline",
      prompt: "consent",
      state,
    });

    return reply.redirect(url);
  });

  /**
   * 2) GET /auth/google/callback
   * - Google redirect về đây với ?code=...&state=...
   * - Verify state bằng cookie
   * - Exchange code -> tokens (lấy id_token)
   * - Dùng usecase của bạn để create/login user và phát JWT của rudex
   * - Redirect về FE callback kèm token (query) để FE lưu vào localStorage rồi vào dashboard
   */
  app.get("/auth/google/callback", async (req, reply) => {
    const oauth2 = makeOauthClient();
    const { code, state } = req.query as { code?: string; state?: string };

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const fail = (reason: string) =>
      reply.redirect(`${frontendUrl}/login?error=${encodeURIComponent(reason)}`);

    // ✅ Lấy state từ signed cookie
    const signedCookie = req.cookies.oauth_state || "";
    const cookieState = req.unsignCookie(signedCookie).value;

    // ✅ Nếu không có code/state hoặc state mismatch => reject (tránh CSRF / flow lệch tab)
    if (!code || !state || !cookieState || cookieState !== state) {
      return fail("google_oauth_invalid_state");
    }

    // ✅ Dùng xong thì clear để không reuse
    reply.clearCookie("oauth_state", { path: "/auth/google/callback" });

    try {
      // ✅ Exchange code (1 lần) -> tokens
      const { tokens } = await oauth2.getToken(code);

      // ✅ Usecase của bạn đang nhận credential = id_token
      const idToken = tokens.id_token;
      if (!idToken) return fail("google_oauth_missing_id_token");

      // ✅ Reuse logic bạn đã viết: verify id token + tạo user + ký JWT của rudex
      const result = await loginGoogleUserUseCase.execute({ credential: idToken });
      if (result.isErr()) return fail("google_oauth_login_failed");

      const data = result.unwrap();
      const accessTokenExpiryDateIso = data.accessTokenExpiryDate.toISOString();

      // ✅ Redirect về FE callback. Dùng query để tránh vấn đề hash bị encode/mất.
      const redirectUrl =
        `${frontendUrl}/auth/google/callback` +
        `?userId=${encodeURIComponent(data.userId)}` +
        `&accessToken=${encodeURIComponent(data.accessToken)}` +
        `&refreshToken=${encodeURIComponent(data.refreshToken)}` +
        `&accessTokenExpiryDate=${encodeURIComponent(accessTokenExpiryDateIso)}`;

      // ✅ set Location thủ công để chắc chắn không bị encode kỳ lạ
      reply.code(302).header("Location", redirectUrl).send();
      return;
    } catch (e) {
      app.log.error(e);
      return fail("google_oauth_exception");
    }
  });
}
