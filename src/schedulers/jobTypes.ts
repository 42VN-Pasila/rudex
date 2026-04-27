import { CreateUserJobPayload } from './jobs/createUser/createUserJobPayload';
import { SendConfirmationEmailJobPayload } from './jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';

export enum JobTypes {
  CreateUser = 'create-user',
  SendConfirmationEmail = 'send-confirmation-email'
}

export type JobToPayloadMap = {
  [JobTypes.SendConfirmationEmail]: SendConfirmationEmailJobPayload;
  [JobTypes.CreateUser]: CreateUserJobPayload;
};
