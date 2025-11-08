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

    async execute(request: IRegisterUserRequest): Promise<IResponse> {
        if (!request) {
            throw new Error('RegisterUserUseCase: Missing request');
        }

        const { username, password, email } = request;

        //Username check
        const usernameRegex  = /^[a-zA-Z0-9_.-]{8,16}$/;
        if (!usernameRegex.test(username))
            return err(InvalidUsernameError.create());
        
        const rudexUserName = await this.userRepo.getByUsername(username);
        if (rudexUserName)
            return err(ExistedUsernameError.create());

        //Email check
        const rudexUserEmail = await this.userRepo.getByEmail(email);
        if (rudexUserEmail)
            return err(ExistedEmailError.create());

        //Password check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])$/;
        if (password.length < 8 || password.length > 16 )
            return err(InvalidPasswordError.create('Password length must be 8-16'));
        else if (!passwordRegex.test(password))
            return err(InvalidPasswordError.create('Password requires at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'));
        else if (/['"\\;]/.test(password) || /'\s'/.test(password))
            return err(InvalidPasswordError.create('Password cannot contain (\'"), backflash and white space'));   
    }

}