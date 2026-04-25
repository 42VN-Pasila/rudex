import { CreateUserJobPayload } from './jobs/createUser/createUserJobPayload';
import { SendConfirmationEmailJobPayload } from './jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';
import { LogoutUserJobPayload } from './jobs/logoutUser/logoutUserJobPayload';

export enum JobTypes {
  SendConfirmationEmail = 'send-confirmation-email',
  CreateUser = 'create-user',
  LogoutUser = 'logout-user'
}

export type JobToPayloadMap = {
  [JobTypes.SendConfirmationEmail]: SendConfirmationEmailJobPayload;
  [JobTypes.CreateUser]: CreateUserJobPayload;
  [JobTypes.LogoutUser]: LogoutUserJobPayload;
};
