import { Worker } from 'bullmq';
import { Kysely } from 'kysely';
import { DB } from '@src/schema';
import { JobTypes } from './jobTypes';
import { JobScheduler } from './jobSchedulers';
import logger from '@src/logger';
import { SendConfirmationEmailWorker } from './jobs/sendConfirmationEmail/sendConfirmationEmailWorker';
import { getRedisConnection } from './config';

export let sendConfirmationEmailScheduler: JobScheduler<JobTypes.SendConfirmationEmail>;
const workers: Worker[] = [];

export function initSchedulers(_db: Kysely<DB>): void {
    const connection = getRedisConnection();

    sendConfirmationEmailScheduler = new JobScheduler(JobTypes.SendConfirmationEmail, connection);
    workers.push(SendConfirmationEmailWorker(connection));

    logger.info('Schedulers initialized', { jobTypes: Object.values(JobTypes) });
}

export async function closeSchedulers(): Promise<void> {
    await Promise.all(workers.map((w) => w.close()));
    workers.length = 0;

    if (sendConfirmationEmailScheduler) {
        await sendConfirmationEmailScheduler.close();
    }

    logger.info('Schedulers closed');
}
