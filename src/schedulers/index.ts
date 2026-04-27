import { Worker } from 'bullmq';
import { JobTypes } from './jobTypes';
import { JobScheduler } from './jobSchedulers';
import logger from '@src/logger';
import { SendConfirmationEmailWorker } from './jobs/sendConfirmationEmail/sendConfirmationEmailWorker';
import { CreateUserWorker } from './jobs/createUser/createUserWorker';

import { UserRepository } from '@repository/userRepository';
import { RegistrationRepository } from '@repository/registrationRepository';
import { db } from '@src/database';
import { getRedisConnection } from './config';

export let sendConfirmationEmailScheduler: JobScheduler<JobTypes.SendConfirmationEmail>;
export let createUserScheduler: JobScheduler<JobTypes.CreateUser>;
const workers: Worker[] = [];

export function initSchedulers(): void {
  const connection = getRedisConnection();

  sendConfirmationEmailScheduler = new JobScheduler(JobTypes.SendConfirmationEmail, connection);
  createUserScheduler = new JobScheduler(JobTypes.CreateUser, connection);

  logger.info('Schedulers initialized', { jobTypes: Object.values(JobTypes) });
}

export function initWorkers(): void {
  const connection = getRedisConnection();
  const userRepo = new UserRepository(db);
  const registrationRepo = new RegistrationRepository(db);

  workers.push(SendConfirmationEmailWorker(connection));
  workers.push(CreateUserWorker(connection, { userRepo, registrationRepo }));

  logger.info('Workers initialized');
}

export async function closeSchedulers(): Promise<void> {
  if (sendConfirmationEmailScheduler) {
    await sendConfirmationEmailScheduler.close();
  }
  if (createUserScheduler) {
    await createUserScheduler.close();
  }

  logger.info('Schedulers closed');
}

export async function closeWorkers(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
  workers.length = 0;

  logger.info('Workers closed');
}
