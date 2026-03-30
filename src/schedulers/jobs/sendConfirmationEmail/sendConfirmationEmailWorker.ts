import { ConnectionOptions, Worker } from 'bullmq';
import { JobTypes } from '@src/schedulers/jobTypes';
import { SendConfirmationEmailJobPayload } from './sendConfirmationEmailJobPayload';
import { SendConfirmationEmailProcessor } from './sendConfirmationEmailProcesor';

export function SendConfirmationEmailWorker(
    connection: ConnectionOptions
): Worker<SendConfirmationEmailJobPayload> {
    return new Worker<SendConfirmationEmailJobPayload>(
        JobTypes.SendConfirmationEmail,
        (job) => SendConfirmationEmailProcessor(job),
        { connection }
    );
}
