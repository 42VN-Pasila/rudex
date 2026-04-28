import { Job } from 'bullmq';
import logger from '@src/logger';
import { configuration } from '@src/config';
import { SendConfirmationEmailJobPayload } from './sendConfirmationEmailJobPayload';
import { sendMail } from '@services/mail/mailer';

export async function SendConfirmationEmailProcessor(
  job: Job<SendConfirmationEmailJobPayload>
): Promise<void> {
  const { userId, email, username, confirmationToken } = job.data;
  logger.info('Processing send confirmation email job', { jobId: job.id, userId, email, username });

  const confirmUrl = `${configuration.baseUrl}/mail/confirm?token=${confirmationToken}`;

  await sendMail({
    to: email,
    subject: 'Confirm your Pickpoker account',
    html: `
            <h2>Welcome to Pickpoker, ${username}!</h2>
            <p>Please confirm your email address by clicking the link below:</p>
            <p><a href="${confirmUrl}">Confirm my account</a></p>
        `
  });
  logger.info('Finished send confirmation email job', { jobId: job.id, userId, email, username });
}
