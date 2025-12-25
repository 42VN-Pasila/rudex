import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class TOTPService {
  private webName: string;
  private issuer: string;

  constructor(webName: string = 'Blank', issuer: string = '42Pasila') {
    this.webName = webName;
    this.issuer = issuer;
  }

  public generateSecret(userEmail: string): speakeasy.GeneratedSecret {
    return speakeasy.generateSecret({
      name: `${this.webName} (${userEmail})`,
      issuer: this.issuer,
      length: 20
    });
  }

  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Generating 2FA QR Code failed');
    }
  }

  public verifyToken(secret: string, token: string, window: number = 2): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window
    });
  }

  public generateCurrentToken(secret: string): string {
    return speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    });
  }
}
