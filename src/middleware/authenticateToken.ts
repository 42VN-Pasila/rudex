import { SQLUserRepo } from "@repository/implementations/sqlUserRepo";

const userRepo = new SQLUserRepo();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) =>{
    
}