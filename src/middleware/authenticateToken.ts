import { SQLUserRepo } from '@repository/implementations/sqlUserRepo';
import { verifyJwt } from '@services/jwt/jwt';
import { Request, Response, NextFunction } from 'express';

const userRepo = new SQLUserRepo();

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = await verifyJwt(token);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      error: 'Unauthorized',
      code: 'INVALID_TOKEN'
    });
  }
};
