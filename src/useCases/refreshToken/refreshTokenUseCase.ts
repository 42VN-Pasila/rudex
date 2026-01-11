import { InvalidTokenError } from '@domain/error/tokenError';
import { IRefreshTokenResponse } from './refreshTokenResponse';
import { IBaseUseCase, Result } from '@useCases/common';
import { IRefreshTokenRequest } from './refreshTokenRequest';

export type IResponse = Result<IRefreshTokenResponse, InvalidTokenError>;

export type IRefreshTokenUseCase = IBaseUseCase<IRefreshTokenRequest, IResponse>;

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    
}
