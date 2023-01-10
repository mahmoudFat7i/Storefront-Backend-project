import { User } from './../models/user';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import JWT, { JwtPayload } from 'jsonwebtoken';

const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction //resolve linter error to not use Function as a type
): void => {
  try {
    const token = (req.headers.authorization as string).split(' ')[1];
    const user = (JWT.decode(token) as JwtPayload).user as User;
    if (user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

export default requireAdmin;
