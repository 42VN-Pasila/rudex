import { SendConfirmationEmailJobPayload } from "./jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload";

export enum JobTypes {
    SendConfirmationEmail = 'send-confirmation-email'
}


export type JobToPayloadMap = {
    [JobTypes.SendConfirmationEmail]: SendConfirmationEmailJobPayload;
};
