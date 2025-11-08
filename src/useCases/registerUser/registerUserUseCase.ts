import { IBaseUseCase, Result } from "@useCases/common";
import { IRegisterUserResponse } from "./registerUserResponse";
import { ExistedUsernameError, InvalidEmailError, InvalidPasswordError } from "@domain/error/userError";
import { IRegisterUserRequest } from "./registerUserRequest";
import { IUserRepo } from "@repository/interfaces/userRepo";

type IResponse = Result<IRegisterUserResponse, ExistedUsernameError | InvalidEmailError | InvalidPasswordError>;

type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IRegisterUserResponse>;

export  class RegisterUserUseCase implements IRegisterUserUseCase{
    private readonly userRepo: IUserRepo;

    constructor(userRepo: IUserRepo){
        this.userRepo = userRepo;
    }
}