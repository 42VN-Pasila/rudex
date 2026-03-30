import { JobsOptions } from 'bullmq';
import { getQueue } from './index';
import logger from '@src/logger';

export async function addJob<T>(
    queueName: string,
    data: T,
    opts?: JobsOptions
): Promise<void> {
    const queue = getQueue(queueName);
    const job = await queue.add(queueName, data as object, opts);
    logger.info('Job enqueued', { queue: queueName, jobId: job.id });
}
