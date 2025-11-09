import jwt from 'jsonwebtoken';

export const jwtConfig = {
  secret:
    process.env.JWT_SECRET ??
    (() => {
      throw new Error('JWT_SECRET not set');
    })(),
  accessTokenExpSec: Number(process.env.ACCESS_TOKEN_EXP ?? '1d'),
  refreshTokenExpSec: Number(process.env.REFRESH_TOKEN_EXP ?? '604800')
};

export function signJwt(
  payload: object,
  expiresInSec: number = jwtConfig.accessTokenExpSec
): string {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: expiresInSec });
}

export function verifyJwt(token: string): object | null {
  const decoded = jwt.verify(token, jwtConfig.secret);
  return typeof decoded === 'object' ? decoded : null;
}
