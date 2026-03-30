import { Queue } from 'bullmq';
import { getRedisConnection } from './config';
import { JobTypes } from './jobTypes';
import logger from '@src/logger';

const queues = new Map<string, Queue>();

export function getQueue(name: string): Queue {
    if (queues.has(name)) {
        return queues.get(name)!;
    }

    const queue = new Queue(name, { connection: getRedisConnection() });
    queues.set(name, queue);
    return queue;
}

export async function initQueues(): Promise<void> {
    for (const jobType of Object.values(JobTypes)) {
        getQueue(jobType);
    }

    logger.info('Queues initialized', { queues: Object.values(JobTypes) });
}

export async function closeQueues(): Promise<void> {
    const closePromises = Array.from(queues.values()).map((q) => q.close());
    await Promise.all(closePromises);
    queues.clear();
    logger.info('Queues closed');
}
