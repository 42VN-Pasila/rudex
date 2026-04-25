import { Job } from 'bullmq';
import logger from '@src/logger';
import { LogoutUserJobPayload } from './logoutUserJobPayload';
import { directorClient } from '@services/director/directorClient';

export async function LogoutUserProcessor(job: Job<LogoutUserJobPayload>): Promise<void> {
  const { username } = job.data;
  logger.info('Processing logout user job', { jobId: job.id, username });

  await directorClient.logoutUser(username);

  logger.info('Finished logout user job', { jobId: job.id, username });
}
