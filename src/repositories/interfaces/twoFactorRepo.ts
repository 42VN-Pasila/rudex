export interface ITwoFactorRepo {
  saveTwoFactorSecret(userId: string, Secret: string): Promise<void>;
  getTwoFactorSecret(userId: string): Promise<string | null>;
  setEnabled(userId: string): Promise<void>;
  isEnabled(userId: string): Promise<boolean>;
}
