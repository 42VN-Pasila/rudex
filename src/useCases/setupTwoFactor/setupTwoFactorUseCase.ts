import { UserNotFoundError } from '@domain/error';
import { ISetUpTwoFactorResponse } from './setupTwoFactorResponse';
import { DatabaseConnectionError, DatabaseOperationError } from '@domain/error/databaseError';
import { err, IBaseUseCase, ok, Result } from '@useCases/common';
import { ISetUpTwoFactorRequest } from './setupTwoFactorRequest';
import { ITwoFactorRepo } from '@repository/interfaces/twoFactorRepo';
import { TOTPService } from '@services/jwt/toptpService';

export type IResponse = Result<
  ISetUpTwoFactorResponse,
  Error | UserNotFoundError | DatabaseConnectionError | DatabaseOperationError
>;

export type ISetUpTwoFactorUseCase = IBaseUseCase<ISetUpTwoFactorRequest, IResponse>;

export class SetUpTwoFactorUseCase implements ISetUpTwoFactorUseCase {
  private readonly twoFactorRepo: ITwoFactorRepo;
  private totpService: TOTPService;

  constructor(twoFactorRepo: ITwoFactorRepo, totpService: TOTPService) {
    this.twoFactorRepo = twoFactorRepo;
    this.totpService = totpService;
  }

  async execute(request?: ISetUpTwoFactorRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('SetUpTwoFactorUseCase: Missing request');
    }

    const { userId, userEmail } = request;

    try {
      const secret = this.totpService.generateSecret(userEmail);

      await this.twoFactorRepo.saveTwoFactorSecret(userId, secret.base32);

      const QRCode = await this.totpService.generateQRCode(secret.otpauth_url!);

      const response: ISetUpTwoFactorResponse = {
        secret: secret.base32,
        qrCode: QRCode
      };

      return ok(response);
    } catch (error) {
      return err(error as Error);
    }
  }
}
