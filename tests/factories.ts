import crypto from 'crypto';

export function generateString(): string {
  return crypto.randomBytes(20).toString('hex');
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generatePassword(): string {
  const buf = crypto.randomBytes(20);
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Hash a password using PBKDF2 (native, salted)
 */
export function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString('hex')
): string {
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}

/**
 * Generate a minimal JWT
 * @param payload object to encode
 * @param secret HMAC secret
 * @param expiresInSec expiry time in seconds
 */
export function generateJwtToken(
  payload: Record<string, unknown>,
  secret: string = 'JWT_SECRET',
  expiresInSec = 3600
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };

  const encode = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const headerB64 = encode(header);
  const bodyB64 = encode(body);
  const data = `${headerB64}.${bodyB64}`;
  const sig = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${data}.${sig}`;
}
