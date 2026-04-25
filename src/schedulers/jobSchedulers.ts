import { ConnectionOptions, JobsOptions, Queue } from 'bullmq';
import { JobToPayloadMap } from './jobTypes';
import { randomUUID } from 'crypto';

export type IJobScheduler<TJobType extends keyof JobToPayloadMap> = {
  readonly jobType: TJobType;
  addJob(payload: JobToPayloadMap[TJobType]): Promise<string>;
  close(): Promise<void>;
};

export class JobScheduler<TJobType extends keyof JobToPayloadMap>
  implements IJobScheduler<TJobType>
{
  private queue: Queue;

  constructor(
    public readonly jobType: TJobType,
    connection: ConnectionOptions
  ) {
    this.queue = new Queue(jobType, { connection });
  }

  async addJob(payload: JobToPayloadMap[TJobType], opts?: JobsOptions): Promise<string> {
    const jobId = opts?.jobId ?? randomUUID();
    await this.queue.add(this.jobType, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      ...opts,
      jobId
    });

    return jobId;
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}
