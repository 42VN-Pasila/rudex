import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { configuration } from '@src/config';
import logger from '@src/logger';

const { host, port, secure, user, pass } = configuration.smtp;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  ...(user && pass ? { auth: { user, pass } } : {})
});

export async function sendMail(options: Mail.Options): Promise<void> {
  const mailOptions: Mail.Options = {
    from: configuration.smtp.from,
    ...options
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info('Email sent', { messageId: info.messageId, to: options.to });
}
