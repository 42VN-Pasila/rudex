export type SendConfirmationEmailJobPayload = {
  userId: string;
  email: string;
  username: string;
  confirmationToken: string;
};
