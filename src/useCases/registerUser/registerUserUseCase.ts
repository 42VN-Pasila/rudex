import { err, IBaseUseCase, Result } from "@useCases/common";
import { IRegisterUserResponse } from "./registerUserResponse";
import { ExistedEmailError, ExistedUsernameError, InvalidEmailError, InvalidPasswordError, InvalidUsernameError } from "@domain/error/userError";
import { IRegisterUserRequest } from "./registerUserRequest";
import { IUserRepo } from "@repository/interfaces/userRepo";

type IResponse = Result<IRegisterUserResponse,InvalidUsernameError | ExistedUsernameError | InvalidEmailError | InvalidPasswordError>;

type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IRegisterUserResponse>;

export  class RegisterUserUseCase implements IRegisterUserUseCase{
    private readonly userRepo: IUserRepo;

    constructor(userRepo: IUserRepo){
        this.userRepo = userRepo;
    }

    private usernameRules = [
        {regex: /.{8,16}/, error: 'Username length must be 8-16.'},
        {regex: /[a-zA-Z0-9_.-]/, error: 'Username can only contains letters, numbers, or [_.-]'}
    ];

    private validateUsername(username: string){
        const error = this.usernameRules
                        .filter(rules => !rules.regex.test(username))
                        .map(rule => rule.error);
        return (error.length > 0 ? error[0]: null);
    }

    private emailRules = [
        {regex: /^[^\s'"\\]+$/, error: 'Email cannot contain whitspace, quote and backflash'},
        {regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, error: 'Email must be a valid address (ex: email@gmail.com)'}
    ];

    private validateEmail(email: string){
        const error = this.emailRules
                        .filter(rules => !rules.regex.test(email))
                        .map(rules => rules.error);
        return (error.length > 0 ? error[0] : null);          
    }

    private passwordRules = [
        {regex: /.{8,16}/, error: 'Password length must be 8-16'},
        {regex: /[a-z]/, error: 'Password requires at least 1 lowercase letter'},
        {regex: /[A-Z]/, error: 'Password requires at least 1 uppercase letter'},
        {regex: /\d/, error: 'Password requires at least 1 number'},
        {regex: /[\W_]/, error: 'Password requires at least 1 special character'},
        {regex: /^[^\s'"\\;]+$/, error: 'Password cannot contain quotes, backflash or whitespace'}
    ];

    private validatePassword(password: string){
        const error = this.passwordRules
                        .filter(rules => !rules.regex.test(password))
                        .map(rules => rules.error);
        return (error.length > 0 ? error[0] : null);
    }

    async execute(request?: IRegisterUserRequest): Promise<IResponse> {
        if (!request) {
            throw new Error('RegisterUserUseCase: Missing request');
        }

        const { username, password, email } = request;

        //Username check
        const usernamError = this.validateUsername(username);
        if (usernamError)
            return err(InvalidUsernameError.create(usernamError));
        
        const rudexUserName = await this.userRepo.getByUsername(username);
        if (rudexUserName)
            return err(ExistedUsernameError.create());

        //Email check
        const emailError = this.validateEmail(email);
        if (emailError)
            return err(InvalidEmailError.create(emailError));

        const rudexUserEmail = await this.userRepo.getByEmail(email);
        if (rudexUserEmail)
            return err(ExistedEmailError.create());

        //Password check
        const passwordError = this.validatePassword(password);
        if (passwordError)
            return err(InvalidPasswordError.create(passwordError));
        
        const user = this.userRepo.save(username, email);
        return ok(user);
    }
}