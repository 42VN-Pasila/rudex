import { SendMailJobPayload } from './jobs/sendMail/sendMailJobPayload';

export enum JobTypes {
  SendEmail = 'SendEmail'
}

export type JobPayloads = {
  [JobTypes.SendEmail]: SendMailJobPayload;
};
