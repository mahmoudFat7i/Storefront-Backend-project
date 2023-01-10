import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import JWT from 'jsonwebtoken';
const { JWT_PRIVATE_KEY } = process.env;

const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction //resolve linter error to not use Function as a type
): void => {
  try {
    const token = (req.headers.authorization as string).split(' ')[1];
    JWT.verify(token, JWT_PRIVATE_KEY as string);
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

export default requireAuth;
