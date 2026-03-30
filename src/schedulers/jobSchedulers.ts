import { ConnectionOptions, Queue } from 'bullmq';
import { JobToPayloadMap } from './jobTypes';

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

  async addJob(payload: JobToPayloadMap[TJobType]): Promise<string> {
    const job = await this.queue.add(this.jobType, payload);
    return job.id!;
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}
