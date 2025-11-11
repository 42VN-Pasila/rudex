import {
  ValidateEmailError,
  ValidatePasswordError,
  ValidateUsernameError
} from '@domain/error/validatorError';
import { ValidateUser } from '@src/valiadators/validateUser';

describe('ValidateUser', () => {
  describe('validateUsername', () => {
    it('Expected Error: Username length must be 8-16.', () => {
      const username = 'user';

      try {
        ValidateUser.validateUsername(username);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidateUsernameError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Username length must be 8-16.');
      }
    });

    it('Expected Error: Username can only contains letters, numbers, or [_.-]', () => {
      const username = '"user" OR 1=1';

      try {
        ValidateUser.validateUsername(username);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidateUsernameError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Username can only contains letters, numbers, or [_.-]');
      }
    });

    it('Expected Sucess', () => {
      const username = 'username';

      expect(() => ValidateUser.validateUsername(username)).not.toThrow();
    });
  });

  describe('validateEmail', () => {
    it('Expected Error: Email cannot contain whitspace, quote and backflash', () => {
      const email = 'this is email@gmail.com';

      try {
        ValidateUser.validateEmail(email);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidateEmailError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Email cannot contain whitspace, quote and backflash');
      }
    });

    it('Expected Error: Email must be a valid address (ex: email@gmail.com)', () => {
      const email = 'ft_transecendenceEmail';

      try {
        ValidateUser.validateEmail(email);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidateEmailError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Email must be a valid address (ex: email@gmail.com)');
      }
    });

    it('Expected Sucess', () => {
      const email = 'thisisemail@test.vn';

      expect(() => ValidateUser.validateEmail(email)).not.toThrow();
    });
  });

  describe('validatePassword', () => {
    it('Expected Error: Password length must be 8-16', () => {
      const password = 'hello';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidateEmailError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password length must be 8-16');
      }
    });

    it('Expected Error: Password requires at least 1 lowercase letter', () => {
      const password = 'THISISPASSWORD';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidatePasswordError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password requires at least 1 lowercase letter');
      }
    });

    it('Expected Error: Password requires at least 1 uppercase letter', () => {
      const password = 'thisispassword';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidatePasswordError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password requires at least 1 uppercase letter');
      }
    });

    it('Expected Error: Password requires at least 1 number', () => {
      const password = 'thisisPASSWORD';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidatePasswordError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password requires at least 1 number');
      }
    });

    it('Expected Error: Password requires at least 1 special character', () => {
      const password = 'th1s1sPASSWORD';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidatePasswordError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password requires at least 1 special character');
      }
    });

    it('Expected Error: Password cannot contain quotes, backflash or whitespace', () => {
      const password = 'th1s !s PASSWORD';

      try {
        ValidateUser.validatePassword(password);
        throw new Error('Expected to be failed');
      } catch (err) {
        if (!(err instanceof ValidatePasswordError)) throw new Error('Wrong type error');
        expect(err.message).toBe('Password cannot contain quotes, backflash or whitespace');
      }
    });

    it('Expected Sucess', () => {
      const password = 'th1s!sPASSWORD';

      expect(() => ValidateUser.validatePassword(password)).not.toThrow();
    });
  });
});
