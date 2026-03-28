type UserNameDto = {
  id: string;
  username: string;
};

export interface IGetUserNamesResponse {
  users: UserNameDto[];
}
