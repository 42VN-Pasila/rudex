import { Worker } from 'bullmq';
import { JobTypes } from './jobTypes';
import { JobScheduler } from './jobSchedulers';
import logger from '@src/logger';
import { SendConfirmationEmailWorker } from './jobs/sendConfirmationEmail/sendConfirmationEmailWorker';
import { getRedisConnection } from './config';

export let sendConfirmationEmailScheduler: JobScheduler<JobTypes.SendConfirmationEmail>;
const workers: Worker[] = [];

export function initSchedulers(): void {
  const connection = getRedisConnection();

  sendConfirmationEmailScheduler = new JobScheduler(JobTypes.SendConfirmationEmail, connection);

  logger.info('Schedulers initialized', { jobTypes: Object.values(JobTypes) });
}

export function initWorkers(): void {
  const connection = getRedisConnection();

  workers.push(SendConfirmationEmailWorker(connection));

  logger.info('Workers initialized');
}

export async function closeSchedulers(): Promise<void> {
  if (sendConfirmationEmailScheduler) {
    await sendConfirmationEmailScheduler.close();
  }

  logger.info('Schedulers closed');
}

export async function closeWorkers(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
  workers.length = 0;

  logger.info('Workers closed');
}
