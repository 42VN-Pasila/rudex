import { Job } from 'bullmq';
export type JobWithId<T = unknown, R = unknown, N extends string = string> = Job<T, R, N> & {
  id: string;
};
export function assertJobHasId<T, R, N extends string>(
  job: Job<T, R, N>
): asserts job is JobWithId<T, R, N> {
  if (!job.id) {
    throw new Error('Job ID is required');
  }
}
