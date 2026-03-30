import fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { configuration } from '@src/config';

const privateKey = fs.readFileSync(
  path.resolve(configuration.jwt.privateKeyPath),
  'utf8'
);

const publicKey = fs.readFileSync(
  path.resolve(configuration.jwt.publicKeyPath),
  'utf8'
);

export function getPublicKey(): string {
  return publicKey;
}

export async function signJwt(payload: object, expiresInSec: number): Promise<string> {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: expiresInSec
  });
}

export async function verifyJwt(token: string): Promise<object | null> {
  const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  return typeof decoded === 'object' ? decoded : null;
}
