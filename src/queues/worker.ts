import { getQueue } from './index';
import { JobTypes } from './jobTypes';
import { processConfirmationEmail } from './processors/sendConfirmationEmail';

export function registerWorkers(): void {
    getQueue(JobTypes.SendConfirmationEmail).process(processConfirmationEmail);
}
