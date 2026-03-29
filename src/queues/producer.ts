import Bull from 'bull';
import { getQueue } from './index';
import logger from '@src/logger';

export async function addJob<T>(
    queueName: string,
    data: T,
    opts?: Bull.JobOptions
): Promise<Bull.Job<T>> {
    const queue = getQueue(queueName);
    const job = await queue.add(data, opts);
    logger.info('Job enqueued', { queue: queueName, jobId: job.id });
    return job;
}
