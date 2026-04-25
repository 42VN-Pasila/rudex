import { Worker } from 'bullmq';
import { JobTypes } from './jobTypes';
import { JobScheduler } from './jobSchedulers';
import logger from '@src/logger';
import { SendConfirmationEmailWorker } from './jobs/sendConfirmationEmail/sendConfirmationEmailWorker';
import { CreateUserWorker } from './jobs/createUser/createUserWorker';
import { LogoutUserWorker } from './jobs/logoutUser/logoutUserWorker';
import { LoginUserWorker } from './jobs/loginUser/loginUserWorker';
import { UserRepository } from '@repository/userRepository';
import { RegistrationRepository } from '@repository/registrationRepository';
import { db } from '@src/database';
import { getRedisConnection } from './config';

export let sendConfirmationEmailScheduler: JobScheduler<JobTypes.SendConfirmationEmail>;
export let createUserScheduler: JobScheduler<JobTypes.CreateUser>;
export let logoutUserScheduler: JobScheduler<JobTypes.LogoutUser>;
export let loginUserScheduler: JobScheduler<JobTypes.LoginUser>;
const workers: Worker[] = [];

export function initSchedulers(): void {
  const connection = getRedisConnection();

  sendConfirmationEmailScheduler = new JobScheduler(JobTypes.SendConfirmationEmail, connection);
  createUserScheduler = new JobScheduler(JobTypes.CreateUser, connection);
  logoutUserScheduler = new JobScheduler(JobTypes.LogoutUser, connection);
  loginUserScheduler = new JobScheduler(JobTypes.LoginUser, connection);

  logger.info('Schedulers initialized', { jobTypes: Object.values(JobTypes) });
}

export function initWorkers(): void {
  const connection = getRedisConnection();
  const userRepo = new UserRepository(db);
  const registrationRepo = new RegistrationRepository(db);

  workers.push(SendConfirmationEmailWorker(connection));
  workers.push(CreateUserWorker(connection, { userRepo, registrationRepo }));
  workers.push(LogoutUserWorker(connection));
  workers.push(LoginUserWorker(connection));

  logger.info('Workers initialized');
}

export async function closeSchedulers(): Promise<void> {
  if (sendConfirmationEmailScheduler) {
    await sendConfirmationEmailScheduler.close();
  }
  if (createUserScheduler) {
    await createUserScheduler.close();
  }
  if (logoutUserScheduler) {
    await logoutUserScheduler.close();
  }
  if (loginUserScheduler) {
    await loginUserScheduler.close();
  }

  logger.info('Schedulers closed');
}

export async function closeWorkers(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
  workers.length = 0;

  logger.info('Workers closed');
}
