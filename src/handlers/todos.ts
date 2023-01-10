import express, { Application, Request, Response } from 'express';
import app from '..';
import { Todo, TodoStore } from '../models/todo';

const todoStore = new TodoStore();

const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTodos = await todoStore.index();
    res.json(newTodos);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getTodo = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const todo: Todo | undefined = await todoStore.show(id);

      if (todo) {
        res.json(todo);
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
};

const createTodo = async (req: Request, res: Response): Promise<void> => {
  const title: string | undefined = req.body.title;
  const userId = parseInt(req.body.userId);

  //ensure title validity
  if (title && typeof title == 'string' && userId && userId >= 1) {
    try {
      const newTodo = await todoStore.create(title, userId);
      res.json(newTodo);
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('bad request');
  }
};

const editTodo = async (req: Request, res: Response): Promise<void> => {
  //ensure todo is found
  const id: number = parseInt(req.params.id as string);

  if (id) {
    try {
      const title: string | undefined = req.body.title;
      const completed: boolean | undefined = req.body.completed;
      //no title or completed sent to edit
      if (!('title' in req.body || 'completed' in req.body)) {
        res.status(400).send('missing parameters');
      }
      //title is sent but not as a string
      else if ('title' in req.body && typeof title != 'string') {
        res.status(400).send('title must be a string');
      }
      //completed is sent but not as a boolean
      else if ('completed' in req.body && typeof completed != 'boolean') {
        res.status(400).send('completed must be a boolean');
      } else {
        const todo = await todoStore.update(id, title, completed);
        res.json(todo);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};
const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const deleted: number | undefined = await todoStore.delete(id);
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
};

const todoHandlers = (app: Application): void => {
  //we will discard corrupted limit/completed but we will validate sort
  app.get('/todos', getTodos);

  //get todo by id, we pass variable url by this syntax :varName
  app.get('/todos/:id', getTodo);

  //post todo, adds a new todo
  app.post('/todos/', createTodo);

  //edit a resource
  app.patch('/todos/:id', editTodo);

  //delete a resouce
  app.delete('/todos/:id', deleteTodo);
};

export default todoHandlers;
