import { UserNameDto } from '@src/dtos/userDto';

export interface IGetUserNamesResponse {
  users: UserNameDto[];
  total: number;
  page: number;
  limit: number;
}
