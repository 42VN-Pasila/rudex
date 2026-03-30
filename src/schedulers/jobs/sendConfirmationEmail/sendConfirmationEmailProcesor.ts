import { Job } from 'bullmq';
import logger from '@src/logger';
import { SendConfirmationEmailJobPayload } from './sendConfirmationEmailJobPayload';
import { sendMail } from '@services/mail/mailer';

export async function SendConfirmationEmailProcessor(
    job: Job<SendConfirmationEmailJobPayload>,
): Promise<void> {
    const { userId, email, username, confirmationToken } = job.data;
    logger.info('Processing send confirmation email job', { jobId: job.id, userId, email, username });
    await sendMail({
        to: email,
        subject: 'Confirm your Rudex account',
        html: `
            <h2>Welcome to Rudex, ${username}!</h2>
            <p>Please confirm your email address by clicking the link below:</p>
            <p><a href="${confirmationToken}">Confirm my account</a></p>
        `
    });
    logger.info('Finished send confirmation email job', { jobId: job.id, userId, email, username });
}
