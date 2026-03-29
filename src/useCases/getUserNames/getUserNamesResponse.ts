import { UserNameDto } from '@src/dtos/userDto';

export type GetUserNamesResponse = {
  users: UserNameDto[];
  total: number;
  page: number;
  limit: number;
}
