import { ValidateUser } from '@src/valiadators/validateUser';

describe('ValidateUser', () => {
  describe('validateUsername', () => {
    it('Expected Error: Username length must be 8-16.', () => {
      const username = 'user';
      const result = ValidateUser.validateUsername(username);

      console.log('Testing @username: ', username);
      expect(result).toBe('Username length must be 8-16.');
    });

    it('Expected Error: Username can only contains letters, numbers, or [_.-]', () => {
      const username = '"user" OR 1=1';
      const result = ValidateUser.validateUsername(username);

      console.log('Testing @username: ', username);
      expect(result).toBe('Username can only contains letters, numbers, or [_.-]');
    });

    it('Expected Sucess', () => {
      const username = 'username';
      const result = ValidateUser.validateUsername(username);

      console.log('Testing @username: ', username);
      expect(result).toBe(null);
    });
  });

  describe('valdiateEmail', () => {
    it('Expected Error: Email cannot contain whitspace, quote and backflash', () => {
      const email = 'this is email@gmail.com';
      const result = ValidateUser.validateEmail(email);

      console.log('Testing @email: ', email);
      expect(result).toBe('Email cannot contain whitspace, quote and backflash');
    });

    it('Expected Error: Email must be a valid address (ex: email@gmail.com)', () => {
      const email = 'ft_transecendenceEmail';
      const result = ValidateUser.validateEmail(email);

      console.log('Testing @email: ', email);
      expect(result).toBe('Email must be a valid address (ex: email@gmail.com)');
    });

    it('Expected Sucess', () => {
      const email = 'thisisemail@test.vn';
      const result = ValidateUser.validateEmail(email);

      console.log('Testing @email: ', email);
      expect(result).toBe(null);
    });
  });

  describe('validatePassword', () => {
    it('Expected Error: Password length must be 8-16', () => {
      const password = 'hello';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password length must be 8-16');
    });

    it('Expected Error: Password requires at least 1 lowercase letter', () => {
      const password = 'THISISPASSWORD';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password requires at least 1 lowercase letter');
    });

    it('Expected Error: Password requires at least 1 uppercase letter', () => {
      const password = 'thisispassword';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password requires at least 1 uppercase letter');
    });

    it('Expected Error: Password requires at least 1 number', () => {
      const password = 'thisisPASSWORD';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password requires at least 1 number');
    });

    it('Expected Error: Password requires at least 1 special character', () => {
      const password = 'th1s1sPASSWORD';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password requires at least 1 special character');
    });

    it('Expected Error: Password cannot contain quotes, backflash or whitespace', () => {
      const password = 'th1s !s PASSWORD';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe('Password cannot contain quotes, backflash or whitespace');
    });

    it('Expected Sucess', () => {
      const password = 'th1s!sPASSWORD';
      const result = ValidateUser.validatePassword(password);

      console.log('Testing @password: ', password);
      expect(result).toBe(null);
    });
  });
});
