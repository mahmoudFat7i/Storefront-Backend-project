import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';

const userRoutes = express.Router();
const userStore = new UserStore();

//we will discard corrupted limit/completed but we will validate sort
userRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const newUsers = await userStore.index();
    res.json(newUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

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
