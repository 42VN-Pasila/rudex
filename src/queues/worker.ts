import { Worker } from 'bullmq';
import { getRedisConnection } from './config';
import { JobTypes } from './jobTypes';
import { processConfirmationEmail } from './processors/sendConfirmationEmail';
import logger from '@src/logger';

const workers: Worker[] = [];

export function registerWorkers(): void {
    const confirmEmailWorker = new Worker(
        JobTypes.SendConfirmationEmail,
        processConfirmationEmail,
        { connection: getRedisConnection() }
    );

    confirmEmailWorker.on('completed', (job) => {
        logger.info('Job completed', { queue: JobTypes.SendConfirmationEmail, jobId: job.id });
    });

    confirmEmailWorker.on('failed', (job, err) => {
        logger.error('Job failed', {
            queue: JobTypes.SendConfirmationEmail,
            jobId: job?.id,
            error: err.message
        });
    });

    workers.push(confirmEmailWorker);
}

export async function closeWorkers(): Promise<void> {
    await Promise.all(workers.map((w) => w.close()));
    workers.length = 0;
    logger.info('Workers closed');
}
