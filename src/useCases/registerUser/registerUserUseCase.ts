import { IBaseUseCase } from "@useCases/common/baseUseCase";
import { IRegisterUserResponse } from "./registerUserResponse";
import { ExistedEmailError, ExistedUsernameError, InvalidEmailError, InvalidPasswordError, InvalidUsernameError } from "@domain/error/userError";
import { IRegisterUserRequest } from "./registerUserRequest";
import { IUserRepo } from "@repository/interfaces/userRepo";
import { ValidationUser } from "@useCases/utils/validationUserUseCase";
import { Result, ok, err } from '@useCases/common';

type IResponse = Result<IRegisterUserResponse,InvalidUsernameError | ExistedUsernameError | InvalidEmailError | ExistedEmailError | InvalidPasswordError>;

type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IResponse>;

export class    RegisterUserUseCase implements IRegisterUserUseCase{
    private readonly userRepo: IUserRepo;
    private readonly userValidate: ValidationUser;

    constructor(userRepo: IUserRepo, userValidate: ValidationUser){
        this.userRepo = userRepo;
        this.userValidate = userValidate;
    }

    async execute(request?: IRegisterUserRequest): Promise<IResponse> {
        if (!request) {
            throw new Error('RegisterUserUseCase: Missing request');
        }

        const { username, password, email } = request;

        //Empty check
        if (!username)
            throw new Error('Username cannot be empty');
        if (!password)
            throw new Error('Password cannot be empty');
        if (!email)
            throw new Error('Email cannot be empty');

        //Username check
        const usernamError = this.userValidate.validateUsername(username);
        if (usernamError)
            return err(InvalidUsernameError.create(usernamError));
        
        const rudexUserName = await this.userRepo.checkExistsByUsername(username);
        if (rudexUserName)
            return err(ExistedUsernameError.create());

        //Email check
        const emailError = this.userValidate.validateEmail(email);
        if (emailError)
            return err(InvalidEmailError.create(emailError));

        const rudexUserEmail = await this.userRepo.getByGoogleUserId(email);
        if (rudexUserEmail)
            return err(ExistedEmailError.create());

        //Password check
        const passwordError = this.userValidate.validatePassword(password);
        if (passwordError)
            return err(InvalidPasswordError.create(passwordError));
        
        const user = await this.userRepo.save({
                                username: username, 
                                googleUserId: email, 
                                password: password});

        const response: IRegisterUserResponse = {rudexUserId: user.id};

        return ok(response);
    }
}