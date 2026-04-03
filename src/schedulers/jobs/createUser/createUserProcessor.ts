import { Job } from 'bullmq';
import logger from '@src/logger';
import { CreateUserJobPayload } from './createUserJobPayload';
import { IUserRepository } from '@repository/userRepository';
import { IRegistrationRepository } from '@repository/registrationRepository';
import { directorClient } from '@services/director/directorClient';

export async function CreateUserProcessor(
  job: Job<CreateUserJobPayload>,
  userRepo: IUserRepository,
  registrationRepo: IRegistrationRepository
): Promise<void> {
  const { registrationId, username, password, email } = job.data;
  logger.info('Processing create user job', { jobId: job.id, username, email });

  await userRepo.save({ username, password, email });
  await registrationRepo.deleteById(registrationId);
  await directorClient.createUser(username);

  logger.info('Finished create user job', { jobId: job.id, username, email });
}
