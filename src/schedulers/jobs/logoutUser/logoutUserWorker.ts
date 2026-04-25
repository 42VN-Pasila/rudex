import { ConnectionOptions, Worker } from 'bullmq';
import { JobTypes } from '@src/schedulers/jobTypes';
import { LogoutUserJobPayload } from './logoutUserJobPayload';
import { LogoutUserProcessor } from './logoutUserProcessor';

export function LogoutUserWorker(connection: ConnectionOptions): Worker<LogoutUserJobPayload> {
  return new Worker<LogoutUserJobPayload>(JobTypes.LogoutUser, (job) => LogoutUserProcessor(job), {
    connection
  });
}
