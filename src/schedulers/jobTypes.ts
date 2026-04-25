import { CreateUserJobPayload } from './jobs/createUser/createUserJobPayload';
import { SendConfirmationEmailJobPayload } from './jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';
import { LogoutUserJobPayload } from './jobs/logoutUser/logoutUserJobPayload';
import { LoginUserJobPayload } from './jobs/loginUser/loginUserJobPayload';


export enum JobTypes {
  SendConfirmationEmail = 'send-confirmation-email',
  CreateUser = 'create-user',
  LogoutUser = 'logout-user',
  LoginUser = 'login-user'
}

export type JobToPayloadMap = {
  [JobTypes.SendConfirmationEmail]: SendConfirmationEmailJobPayload;
  [JobTypes.CreateUser]: CreateUserJobPayload;
  [JobTypes.LogoutUser]: LogoutUserJobPayload;
  [JobTypes.LoginUser]: LoginUserJobPayload;
};
