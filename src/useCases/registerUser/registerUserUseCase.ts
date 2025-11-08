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

        const usernameRegex  = /^[a-zA-Z0-9_.-]{8,16}$/;
        if (!usernameRegex.test(username))
            return err(InvalidUsernameError.create());
        
        const rudexUserName = await this.userRepo.getByUsername(username);
        if (rudexUserName)
            return err(ExistedUsernameError.create());


        const rudexUserEmail = await this.userRepo.getByEmail(email);
        if (rudexUserEmail)
            return err(ExistedEmailError.create());

        //Check email logic

        if ()

    }

}