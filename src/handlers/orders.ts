import express, { Request, Response } from 'express';
import authenticate from '../middlewares/authentication';
import { Order, OrderStore } from './../models/order';

const store = new OrderStore();
const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};
const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const productId: number = parseInt(req.params.product_id);
    const quantity: number = parseInt(req.body.quantity);
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id);
  try {
    const addedProduct = await store.getUserOrders(userId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const setOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const status: string = req.body.status;
    const order = await store.setOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};
const orderRoutes = (app: express.Application): void => {
  app.post('/orders', authenticate, create);
  app.post('/orders/:id', authenticate, addProduct);
  app.get('/users/:id/orders', getUserOrders);
  app.patch('/orders/:id', setOrderStatus);
};

export default orderRoutes;
