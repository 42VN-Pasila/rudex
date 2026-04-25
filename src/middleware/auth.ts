import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyJwt, signJwt } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';

const PUBLIC_ROUTES = ['/login', '/register', '/mail/confirm', '/.well-known/jwks.json', '/logout'];

function extractToken(request: FastifyRequest): string | undefined {
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return request.cookies?.access_token;
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.method === 'OPTIONS') {
    return;
  }

  if (PUBLIC_ROUTES.includes(request.url.split('?')[0])) {
    return;
  }

  const accessToken = extractToken(request);
  if (!accessToken) {
    return reply.status(401).send({ error: 'Not authenticated' });
  }

  const result = verifyJwt(accessToken);

  if (result.status === 'valid') {
    request.user = result.payload;
    return;
  }

  if (result.status === 'expired') {
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      return reply.status(401).send({ error: 'Token expired' });
    }

    const refreshResult = verifyJwt(refreshToken);
    if (refreshResult.status !== 'valid') {
      return reply.status(401).send({ error: 'Refresh token invalid' });
    }

    const newAccessToken = await signJwt(
      { username: refreshResult.payload.username },
      JWT_ACCESS_TOKEN_EXP
    );

    reply.setCookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_ACCESS_TOKEN_EXP
    });

    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_REFRESH_TOKEN_EXP
    });

    request.user = refreshResult.payload;
    return;
  }

  return reply.status(401).send({ error: 'Invalid token' });
}
