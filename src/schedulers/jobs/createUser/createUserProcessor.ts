import { Job } from 'bullmq';
import logger from '@src/logger';
import { CreateUserJobPayload } from './createUserJobPayload';
import { directorClient } from '@services/director/directorClient';
import { assertJobHasId } from '@src/schedulers/utils';
import { CreateUserWorkerDeps } from './createUserWorker';

export async function CreateUserProcessor(
  job: Job<CreateUserJobPayload>,
  deps: CreateUserWorkerDeps
): Promise<void> {
  const { registrationId, username, password, email } = job.data;
  assertJobHasId(job);
  logger.info('Processing create user job', { jobId: job.id, username, email });

  await deps.userRepo.save({ username, password, email });
  await deps.registrationRepo.deleteById(registrationId);
  await directorClient.createUser(username);

  logger.info('Finished create user job', { jobId: job.id, username, email });
}
