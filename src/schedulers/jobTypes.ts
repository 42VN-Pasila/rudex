import { CreateUserJobPayload } from './jobs/createUser/createUserJobPayload';
import { SendConfirmationEmailJobPayload } from './jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';

export enum JobTypes {
  SendConfirmationEmail = 'send-confirmation-email',
  CreateUser = 'create-user'
}

export type JobToPayloadMap = {
  [JobTypes.SendConfirmationEmail]: SendConfirmationEmailJobPayload;
  [JobTypes.CreateUser]: CreateUserJobPayload;
};
