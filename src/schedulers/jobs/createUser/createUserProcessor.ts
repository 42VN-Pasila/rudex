import { Job } from 'bullmq';
import logger from '@src/logger';
import { CreateUserJobPayload } from './createUserJobPayload';
import { IUserRepository } from '@repository/userRepository';

export async function CreateUserProcessor(
  job: Job<CreateUserJobPayload>,
  userRepo: IUserRepository
): Promise<void> {
  const { username, password, email } = job.data;
  logger.info('Processing create user job', { jobId: job.id, username, password, email });
  await userRepo.save({ username, password, email });
  logger.info('Finished create user job', { jobId: job.id, username, password, email });
}
