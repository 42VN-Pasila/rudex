import { ConnectionOptions, Worker } from 'bullmq';
import { JobTypes } from '@src/schedulers/jobTypes';
import { CreateUserJobPayload } from './createUserJobPayload';
import { CreateUserProcessor } from './createUserProcessor';
import { IUserRepository } from '@repository/userRepository';

export function SendConfirmationEmailWorker(
  connection: ConnectionOptions,
  userRepo: IUserRepository
): Worker<CreateUserJobPayload> {
  return new Worker<CreateUserJobPayload>(
    JobTypes.CreateUser,
    (job) => CreateUserProcessor(job, userRepo),
    { connection }
  );
}
