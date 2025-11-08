import { components } from "@src/gen/server";
import { HttpRequest, HttpResponse, IBaseController } from "@useCases/common";
import { IRegisterUserRequest } from "./registerUserRequest";
import {RegisterUserUseCase} from "./registerUserUseCase";
import { ExistedUsernameError, InvalidEmailError, InvalidPasswordError } from "@domain/error/userError";

type Response = HttpResponse<undefined, components['schemas']['RegisterResponseBody']>;

export class RegisterUserController extends IBaseController<HttpRequest, Response>{
    private readonly registerUserUseCase : RegisterUserUseCase;

    constructor(registerUserUseCase: RegisterUserUseCase){
        super();
        this.registerUserUseCase = registerUserUseCase;
    }
    
    async execute(request: HttpRequest): Promise<Response>{        
        const registerUserRequest: IRegisterUserRequest = {
            username: request.body.username,
            password: request.body.password,
            email:  request.body.email
        };
    
        const result = await this.registerUserUseCase.execute(registerUserRequest);
        
        if (result.isErr()) {
            const error: Error = result.unwrapErr()
            
            if (error instanceof ExistedUsernameError)
                return this.conflict(error.message);
            return this.badRequest(error.message);
        }
        
        const   responseBody = result.unwrap();
        
        return this.ok(responseBody);
    }
}