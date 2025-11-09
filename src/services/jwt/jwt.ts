import jwt from 'jsonwebtoken';

export async function signJwt(payload: object, expiresInSec: number): Promise<string> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn: expiresInSec });
}
export async function verifyJwt(token: string): Promise<object | null> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  const decoded = jwt.verify(token, secret);
  return typeof decoded === 'object' ? decoded : null;
}
