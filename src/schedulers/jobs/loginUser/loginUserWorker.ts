import { Worker, ConnectionOptions } from 'bullmq';
import { JobTypes } from '../../jobTypes';
import { directorClient } from '@src/services/director/directorClient';
import logger from '@src/logger';
import { assertJobHasId } from '../../utils';
import { LoginUserJobPayload } from './loginUserJobPayload';

export function LoginUserWorker(connection: ConnectionOptions): Worker {
  return new Worker<LoginUserJobPayload>(
    JobTypes.LoginUser,
    async (job) => {
      assertJobHasId(job);
      logger.info(`Processing login user job for ${job.data.username}`, { jobId: job.id });
      await directorClient.loginUser(job.data.username);
    },
    { connection }
  );
}
