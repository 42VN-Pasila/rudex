import { ConnectionOptions, Worker } from 'bullmq';
import { JobTypes } from '@src/schedulers/jobTypes';
import { CreateUserJobPayload } from './createUserJobPayload';
import { CreateUserProcessor } from './createUserProcessor';
import { IUserRepository } from '@repository/userRepository';
import { IRegistrationRepository } from '@repository/registrationRepository';

export type CreateUserWorkerDeps = {
  userRepo: IUserRepository;
  registrationRepo: IRegistrationRepository;
};

export function CreateUserWorker(
  connection: ConnectionOptions,
  deps: CreateUserWorkerDeps
): Worker<CreateUserJobPayload> {
  return new Worker<CreateUserJobPayload>(
    JobTypes.CreateUser,
    (job) => CreateUserProcessor(job, deps),
    { connection }
  );
}
