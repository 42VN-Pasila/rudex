import {
  ValidateEmailError,
  ValidatePasswordError,
  ValidateUsernameError
} from '@domain/error/validatorError';
import { ValidateUser } from '@src/valiadators/validateUser';

describe('ValidateUser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateUsername', () => {
    it('Expected Error: Username length must be 8-16.', () => {
      const spy = jest.spyOn(ValidateUser, 'validateUsername');
      const username = 'user';
      expect(() => ValidateUser.validateUsername(username)).toThrow(ValidateUsernameError);
      expect(() => ValidateUser.validateUsername(username)).toThrow(
        'Username length must be 8-16.'
      );
      expect(spy).toHaveBeenCalledWith(username);
    });

    it('Expected Error: Username can only contains letters, numbers, or [_.-]', () => {
      const spy = jest.spyOn(ValidateUser, 'validateUsername');
      const username = '"user" OR 1=1';
      expect(() => ValidateUser.validateUsername(username)).toThrow(ValidateUsernameError);
      expect(() => ValidateUser.validateUsername(username)).toThrow(
        'Username can only contains letters, numbers, or [_.-]'
      );
      expect(spy).toHaveBeenCalledWith(username);
    });

    it('Expected Success', () => {
      const spy = jest.spyOn(ValidateUser, 'validateUsername');
      const username = 'username';
      expect(() => ValidateUser.validateUsername(username)).not.toThrow();
      expect(spy).toHaveBeenCalledWith(username);
    });
  });

  describe('validateEmail', () => {
    it('Expected Error: Email cannot contain whitspace, quote and backflash', () => {
      const spy = jest.spyOn(ValidateUser, 'validateEmail');
      const email = 'this is email@gmail.com';
      expect(() => ValidateUser.validateEmail(email)).toThrow(ValidateEmailError);
      expect(() => ValidateUser.validateEmail(email)).toThrow(
        'Email cannot contain whitspace, quote and backflash'
      );
      expect(spy).toHaveBeenCalledWith(email);
    });

    it('Expected Error: Email must be a valid address (ex: email@gmail.com)', () => {
      const spy = jest.spyOn(ValidateUser, 'validateEmail');
      const email = 'ft_transecendenceEmail';
      expect(() => ValidateUser.validateEmail(email)).toThrow(ValidateEmailError);
      expect(() => ValidateUser.validateEmail(email)).toThrow(
        'Email must be a valid address (ex: email@gmail.com)'
      );
      expect(spy).toHaveBeenCalledWith(email);
    });

    it('Expected Success', () => {
      const spy = jest.spyOn(ValidateUser, 'validateEmail');
      const email = 'thisisemail@test.vn';
      expect(() => ValidateUser.validateEmail(email)).not.toThrow();
      expect(spy).toHaveBeenCalledWith(email);
    });
  });

  describe('validatePassword', () => {
    it('Expected Error: Password length must be 8-16', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'hello';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow('Password length must be 8-16');
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Error: Password requires at least 1 lowercase letter', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'THISISPASSWORD';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow(
        'Password requires at least 1 lowercase letter'
      );
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Error: Password requires at least 1 uppercase letter', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'thisispassword';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow(
        'Password requires at least 1 uppercase letter'
      );
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Error: Password requires at least 1 number', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'thisisPASSWORD';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow(
        'Password requires at least 1 number'
      );
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Error: Password requires at least 1 special character', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'th1s1sPASSWORD';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow(
        'Password requires at least 1 special character'
      );
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Error: Password cannot contain quotes, backflash or whitespace', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'th1s !s PASSWORD';
      expect(() => ValidateUser.validatePassword(password)).toThrow(ValidatePasswordError);
      expect(() => ValidateUser.validatePassword(password)).toThrow(
        'Password cannot contain quotes, backflash or whitespace'
      );
      expect(spy).toHaveBeenCalledWith(password);
    });

    it('Expected Success', () => {
      const spy = jest.spyOn(ValidateUser, 'validatePassword');
      const password = 'th1s!sPASSWORD';
      expect(() => ValidateUser.validatePassword(password)).not.toThrow();
      expect(spy).toHaveBeenCalledWith(password);
    });
  });
});
