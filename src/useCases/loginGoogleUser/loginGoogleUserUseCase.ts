import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { Result, ok, err } from '@useCases/common';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { InvalidCredentialsError } from '@domain/error';
import { signJwt } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';
import { verifyGoogleIdToken } from '@services/google/verifyGoogleIdToken';
import { ILoginGoogleUserRequest } from './loginGoogleUserRequest';
import { ILoginUserResponse } from '@useCases/loginUser/loginUserResponse';

export type IResponse = Result<ILoginUserResponse, InvalidCredentialsError>;
export type ILoginGoogleUserUseCase = IBaseUseCase<ILoginGoogleUserRequest, IResponse>;

function makeBaseUsernameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'player';
  const cleaned = local.replace(/[^a-zA-Z0-9_.-]/g, '') || 'player';
  return cleaned.slice(0, 16);
}

export class LoginGoogleUserUseCase implements ILoginGoogleUserUseCase {
  private readonly userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request?: ILoginGoogleUserRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('LoginGoogleUserUseCase: Missing reques');
    }

    const { credential } = request;

    let google;
    try {
      google = await verifyGoogleIdToken(credential);
    } catch {
      return err(InvalidCredentialsError.create());
    }

    if (google.email_verified === false) {
      return err(InvalidCredentialsError.create());
    }

    let user = await this.userRepo.getByGoogleUserId(google.sub);

    if (!user) {
      const byEmail = await this.userRepo.checkExistsByEmail(google.email);

      if (byEmail) {
        user = await this.userRepo.save({
          username: byEmail.username,
          email: byEmail.email,
          googleUserId: google.sub,
          googleUserName: google.name
        });
      } else {
        const base = makeBaseUsernameFromEmail(google.email);

        let candidate = base;
        let i = 1;
        while (await this.userRepo.checkExistsByUsername(candidate)) {
          const suffix = String(i);
          const cutLen = 16 - suffix.length;
          candidate = base.slice(0, Math.max(1, cutLen)) + suffix;
          i += 1;
        }

        user = await this.userRepo.save({
          username: candidate,
          email: google.email,
          googleUserId: google.sub,
          googleUserName: google.name
        });
      }
    }

    const accessToken = await signJwt({userId: user.id}, JWT_ACCESS_TOKEN_EXP);
    const refreshToken = await signJwt({userId: user.id}, JWT_REFRESH_TOKEN_EXP);
    const accessTokenExpiryDate = new Date(Date.now() + JWT_ACCESS_TOKEN_EXP * 1000);
    
    return ok({
        userId: user.id,
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
    })
  }
}
