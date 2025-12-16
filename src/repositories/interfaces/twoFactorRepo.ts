export interface ITwoFactorRepo {
  saveTwoFactorKey(userId: string, key: string): Promise<void>;
  getTwoFactorKey(userId: string): Promise<string | null>;
  setEnabled(userId: string): Promise<void>;
  isEnabled(userId: string): Promise<boolean>;
}
