import type { ColumnType, Generated } from 'kysely';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface UserTable {
  id: Generated<string>;
  username: string;
  password: string | null;
  email: string;
  google_user_id: string | null;
  google_user_name: string | null;
  access_token: string | null;
  access_token_expiry_date: Timestamp | null;
  refresh_token: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface DB {
  user: UserTable;
}
