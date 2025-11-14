import crypto from 'crypto';

export function generateString(): string {
  return crypto.randomBytes(10).toString('hex');
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generatePassword(): string {
  const buf = crypto.randomBytes(20);
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateEmail(): string {
  const generateShortString = () => crypto.randomBytes(2).toString('hex');
  return generateShortString() + '.' + generateShortString() + '@gmail.com';
}

/**
 * Generate a minimal JWT
 * @param payload object to encode
 * @param secret HMAC secret
 * @param expiresInSec expiry time in seconds
 */
export function generateJwtToken(payload: Record<string, unknown>, expiresInSec = 3600): string {
  const secret: string = 'JWT_SECRET';
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRequest(body: any) {
  return {
    body: {
      value: body
    }
  };
}
