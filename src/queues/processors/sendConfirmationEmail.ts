import { Job } from 'bullmq';
import { sendMail } from '@src/services/mail/mailer';
import { configuration } from '@src/config';
import logger from '@src/logger';

export interface SendConfirmationEmailPayload {
    userId: string;
    email: string;
    username: string;
    confirmationToken: string;
}

export async function processConfirmationEmail(
    job: Job<SendConfirmationEmailPayload>
): Promise<void> {
    const { userId, email, username, confirmationToken } = job.data;

    logger.info('Processing confirmation email', { userId, email, username });

    const confirmUrl = `${configuration.baseUrl}/mail/confirm?token=${confirmationToken}`;

    await sendMail({
        to: email,
        subject: 'Confirm your Rudex account',
        html: `
            <h2>Welcome to Rudex, ${username}!</h2>
            <p>Please confirm your email address by clicking the link below:</p>
            <p><a href="${confirmUrl}">Confirm my account</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not register, you can safely ignore this email.</p>
        `
    });

    logger.info('Confirmation email sent', { userId, email });
}
