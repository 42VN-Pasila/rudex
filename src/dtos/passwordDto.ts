export type PasswordDto = {
  password: string;
};

export type UpdatePasswordDto = {
  currentPassword: PasswordDto['password'];
  newPassword: PasswordDto['password'];
};