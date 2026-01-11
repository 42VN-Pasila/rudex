import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import { SQLUserRepo } from "@repository/implementations/sqlUserRepo";
import { LoginGoogleUserUseCase } from "@useCases/loginGoogleUser/loginGoogleUserUseCase";

function makeOauthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI");
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export default async function googleOAuthRoutes(app: FastifyInstance) {
  const userRepo = new SQLUserRepo();
  const loginGoogleUserUseCase = new LoginGoogleUserUseCase(userRepo);

  app.get("/auth/google", async (_req, reply) => {
    const oauth2 = makeOauthClient();

    const state = crypto.randomUUID();
    reply.setCookie("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", 
      path: "/auth/google/callback", 
      signed: true, 
      maxAge: 5 * 60,
    });

    const url = oauth2.generateAuthUrl({
      scope: ["openid", "email", "profile"],
      access_type: "offline",
      prompt: "consent",
      state,
    });

    return reply.redirect(url);
  });

  app.get("/auth/google/callback", async (req, reply) => {
    const oauth2 = makeOauthClient();
    const { code, state } = req.query as { code?: string; state?: string };

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const fail = (reason: string) =>
      reply.redirect(`${frontendUrl}/login?error=${encodeURIComponent(reason)}`);

    const signedCookie = req.cookies.oauth_state || "";
    const cookieState = req.unsignCookie(signedCookie).value;

    if (!code || !state || !cookieState || cookieState !== state) {
      return fail("google_oauth_invalid_state");
    }

    reply.clearCookie("oauth_state", { path: "/auth/google/callback" });

    try {
      const { tokens } = await oauth2.getToken(code);

      const idToken = tokens.id_token;
      if (!idToken) return fail("google_oauth_missing_id_token");

      const result = await loginGoogleUserUseCase.execute({ credential: idToken });
      if (result.isErr()) return fail("google_oauth_login_failed");

      const data = result.unwrap();
      const accessTokenExpiryDateIso = data.accessTokenExpiryDate.toISOString();

      const redirectUrl =
        `${frontendUrl}/auth/google/callback` +
        `?userId=${encodeURIComponent(data.userId)}` +
        `&accessToken=${encodeURIComponent(data.accessToken)}` +
        `&refreshToken=${encodeURIComponent(data.refreshToken)}` +
        `&accessTokenExpiryDate=${encodeURIComponent(accessTokenExpiryDateIso)}`;

      reply.code(302).header("Location", redirectUrl).send();
      return;
    } catch (e) {
      app.log.error(e);
      return fail("google_oauth_exception");
    }
  });
}
