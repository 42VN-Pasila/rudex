import { DatabaseConnectionError, DatabaseOperationError } from '@domain/error/databaseError';
import { IBaseUseCase, Result } from '@useCases/common';
import { ISetUpTwoFactorResponse } from '@useCases/setupTwoFactor/setupTwoFactorResponse';
import { IVerifyTwoFactorRequest } from './verifyTwoFactorRequest';
import { TOTPService } from '@services/jwt/toptpService';

export type IResponse = Result<
  ISetUpTwoFactorResponse,
  Error | DatabaseConnectionError | DatabaseOperationError
>;

export type IVerifyTwoFactorUseCase = IBaseUseCase<IVerifyTwoFactorRequest, IResponse>;

export class VerifyTwoFactorUseCase implements IVerifyTwoFactorUseCase {
    private readonly twoFactorRepo: ITwoFactorRepo;
    private totpService: TOTPService;

    constructor()
}
