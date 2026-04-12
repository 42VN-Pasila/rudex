import type { UpdatePasswordDto } from '@src/dtos/passwordDto';

export type UpdatePasswordRequest = {
  username: string;
} & UpdatePasswordDto;