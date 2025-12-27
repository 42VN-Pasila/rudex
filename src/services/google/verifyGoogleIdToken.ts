import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error('GOOGLE_CLIENT_ID is not defined');
}

const oauth2Client = new OAuth2Client(clientId);

export type GoogleIdPayload = {
  sub: string;
  email: string;
  name?: string;
  email_verified?: boolean;
};

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdPayload> {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: clientId
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    email_verified: payload.email_verified
  };
}
