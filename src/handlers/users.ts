import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;
const Store = new UserStore();

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };
    const newUser = await Store.create(user);
    const token = jwt.sign(
      {
        user: {
          user_name: newUser.user_name,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          id: newUser.id
        }
      },
      tokenSecret as string
    );
    res.json(token);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = (await Store.authenticate(
      req.body.user_name,
      req.body.password
    )) as User;

    const token = jwt.sign(
      {
        user: {
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          id: user.id
        }
      },
      tokenSecret as string
    );
    res.json(token);
  } catch (err) {
    res.status(401);
    res.json({ Error: 'incorrect user and/ or password' });
  }
};

const userHandlers = (app: express.Application): void => {
  app.post('/users', create);
  app.post('/authenticate', authenticate);
};

export default userHandlers;
