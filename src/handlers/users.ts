import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import requireAdmin from '../middlewares/requireAdmin';
import requireAuth from '../middlewares/requireAuth';
import { User, UserStore } from '../models/user';

const userRoutes = express.Router();
const userStore = new UserStore();
const { JWT_PRIVATE_KEY } = process.env;
//we will discard corrupted limit/completed but we will validate sort
userRoutes.get(
  '/',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newUsers = await userStore.index();
      res.json(newUsers);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

//get user by id, we pass variable url by this syntax :varName
userRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const user: User | undefined = await userStore.show(id);

      if (user) {
        res.json(user);
      } else {
        res.status(404).send('resource not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
});

//post user, adds a new user
userRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
  const username: string | undefined = req.body.username;
  const password: string | undefined = req.body.password;

  //ensure title validity
  if (
    username &&
    typeof username == 'string' &&
    password &&
    typeof password == 'string'
  ) {
    const newUser = await userStore.create(username, password);
    const jwt = JWT.sign(
      {
        username: newUser.username,
        id: newUser.id,
        role:newUser.role
      },
      JWT_PRIVATE_KEY as string
    );
    res.json(jwt);
  } else {
    res.status(400).send('bad request');
  }
});

//authenticate user, adds a new user
userRoutes.post(
  '/authentication',
  async (req: Request, res: Response): Promise<void> => {
    const username: string | undefined = req.body.username;
    const password: string | undefined = req.body.password;

    //ensure title validity
    if (
      username &&
      typeof username == 'string' &&
      password &&
      typeof password == 'string'
    ) {
      const user = await userStore.authenticate(username, password);
      if (user) {
        const jwt = JWT.sign(
          {
            username: user.username,
            id: user.id,
            role: user.role
          },
          JWT_PRIVATE_KEY as string
        );
        res.json(jwt);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.status(400).send('bad request');
    }
  }
);

//delete a resouce
userRoutes.delete(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deleted: number | undefined = await userStore.delete(id);
        if (deleted) {
          res.sendStatus(204);
        } else {
          res.status(404).send('resource not found');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.sendStatus(404);
    }
  }
);

export default userRoutes;
