import { getQueue } from './index';
import { JobTypes } from './jobTypes';
import { processConfirmationEmail } from './processors/sendConfirmationEmail';
import logger from '@src/logger';

export function registerWorkers(): void {
    const queue = getQueue(JobTypes.SendConfirmationEmail);
    queue.process(processConfirmationEmail);

    queue.on('failed', (job, err) => {
        logger.error('Job failed', { queue: job.queue.name, jobId: job.id, error: err.message });
    });

    queue.on('completed', (job) => {
        logger.info('Job completed', { queue: job.queue.name, jobId: job.id });
    });
}
