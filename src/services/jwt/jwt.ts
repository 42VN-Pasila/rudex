import fs from 'node:fs';
import path from 'node:path';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { configuration } from '@src/config';

const privateKey = fs.readFileSync(path.resolve(configuration.jwt.privateKeyPath), 'utf8');

const publicKey = fs.readFileSync(path.resolve(configuration.jwt.publicKeyPath), 'utf8');

export interface JwtPayload {
  username: string;
}

export function getPublicKey(): string {
  return publicKey;
}

export async function signJwt(payload: object, expiresInSec: number): Promise<string> {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: expiresInSec
  });
}

export type VerifyResult =
  | { status: 'valid'; payload: JwtPayload }
  | { status: 'expired'; payload: JwtPayload }
  | { status: 'invalid' };

export function verifyJwt(token: string): VerifyResult {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return { status: 'valid', payload: decoded as JwtPayload };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      const decoded = jwt.decode(token) as JwtPayload | null;
      if (decoded) {
        return { status: 'expired', payload: decoded };
      }
    }
    return { status: 'invalid' };
  }
}
