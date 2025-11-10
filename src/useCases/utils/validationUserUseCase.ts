export class ValidationUser {
  private usernameRules = [
    { regex: /.{8,16}/, error: 'Username length must be 8-16.' },
    { regex: /^[a-zA-Z0-9_.-]+$/, error: 'Username can only contains letters, numbers, or [_.-]' }
  ];

  public validateUsername(username: string): string | null {
    const error = this.usernameRules
      .filter((rule) => !rule.regex.test(username))
      .map((rule) => rule.error);
    return error.length > 0 ? error[0] : null;
  }

  private emailRules = [
    { regex: /^[^\s'"\\]+$/, error: 'Email cannot contain whitspace, quote and backflash' },
    {
      regex: /^[A-Za-z0-9._%+-]+@gmail\.com$/,
      error: 'Email must be a valid address (ex: email@gmail.com)'
    }
  ];

  public validateEmail(email: string): string | null {
    const error = this.emailRules
      .filter((rule) => !rule.regex.test(email))
      .map((rule) => rule.error);
    return error.length > 0 ? error[0] : null;
  }

  private passwordRules = [
    { regex: /.{8,16}/, error: 'Password length must be 8-16' },
    { regex: /[a-z]/, error: 'Password requires at least 1 lowercase letter' },
    { regex: /[A-Z]/, error: 'Password requires at least 1 uppercase letter' },
    { regex: /\d/, error: 'Password requires at least 1 number' },
    { regex: /[\W_]/, error: 'Password requires at least 1 special character' },
    { regex: /^[^\s'"\\;]+$/, error: 'Password cannot contain quotes, backflash or whitespace' }
  ];

  public validatePassword(password: string): string | null {
    const error = this.passwordRules
      .filter((rule) => !rule.regex.test(password))
      .map((rule) => rule.error);
    return error.length > 0 ? error[0] : null;
  }
}
