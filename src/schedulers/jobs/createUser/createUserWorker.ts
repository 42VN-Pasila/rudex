import { ConnectionOptions, Worker } from 'bullmq';
import { JobTypes } from '@src/schedulers/jobTypes';
import { CreateUserJobPayload } from './createUserJobPayload';
import { CreateUserProcessor } from './createUserProcessor';
import { IUserRepository } from '@repository/userRepository';
import { IRegistrationRepository } from '@repository/registrationRepository';

export function CreateUserWorker(
  connection: ConnectionOptions,
  userRepo: IUserRepository,
  registrationRepo: IRegistrationRepository
): Worker<CreateUserJobPayload> {
  return new Worker<CreateUserJobPayload>(
    JobTypes.CreateUser,
    (job) => CreateUserProcessor(job, userRepo, registrationRepo),
    { connection }
  );
}
