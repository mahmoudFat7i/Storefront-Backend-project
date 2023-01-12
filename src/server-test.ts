import supertest from 'supertest';
import app from './server';
import { User, UserStore } from './models/user';
import { Product } from './models/product';
import { Order } from './models/order';
import jwt_decode from 'jwt-decode';
const request = supertest(app);
const uStore = new UserStore();
const user: User = {
  user_name: 'stewieGriffen',
  first_name: 'hello',
  last_name: 'world',
  password: 'veryDifficultImpossibleToGuessUnexpected LongPassword'
};
const newUser: User = {
  user_name: 'evilstewieGriffen',
  first_name: 'evil',
  last_name: 'StewieGriffen',
  password:
    'DefinetelyNotAveryDifficultImpossibleToGuessUnexpected LongPassword'
};
const createdUser: User = { ...newUser, id: 2 };
let product: Product = {
  name: 'time machine',
  price: 100
};
let order: Order = {
  user_id: 1,
  status: 'active'
};
type DecodedJWT = {
  user: User;
};
const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};
let token: string;
describe('routes test', () => {
  beforeAll(async () => {
    //must have a user to start with
    await uStore.create(user);
  });

  describe('main route tests', () => {
    it('gets the main endpoint', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('API Endpoints');
    });
  });

  describe('authenticate route tests', () => {
    it('user should authenticate successfully when given a correct user_name, password', async () => {
      const response = await request
        .post('/authenticate')
        .set(jsonHeaders)
        .send((({ user_name, password }) => ({ user_name, password }))(user));
      expect(response.status).toBe(200);
      token = 'Bearer' + response.body;
      const decodedUser: User = (jwt_decode(response.body) as DecodedJWT).user;
      expect(decodedUser.first_name).toEqual(user.first_name);
      expect(decodedUser.last_name).toEqual(user.last_name);
      expect(decodedUser.id).toEqual(1);
      expect(decodedUser.user_name).toEqual(user.user_name);
      expect(decodedUser.password).toBeUndefined();
    });
  });
  describe('Access Denied tests', () => {
    it('user sould reveive 401 trying to create user with no token', async () => {
      const response = await request.post('/users');
      expect(response.status).toBe(401);
    });

    it('user sould reveive 401 trying to get user orders with no token', async () => {
      const response = await request.get('/users/1/orders');
      expect(response.status).toBe(401);
    });

    it('user sould reveive 401 trying to create product with no token', async () => {
      const response = await request.post('/product');
      expect(response.status).toBe(401);
    });
    it('user sould reveive 401 trying to create order with no token', async () => {
      const response = await request.post('/order');
      expect(response.status).toBe(401);
    });
    it('user sould reveive 401 trying to edit order with no token', async () => {
      const response = await request.patch('/order');
      expect(response.status).toBe(401);
    });
    it('user sould reveive 401 trying to add product to an order with no token', async () => {
      const response = await request.post('/users');
      expect(response.status).toBe(401);
    });
  });
  describe('Creation routes test', () => {
    it('user can create a user', async () => {
      const response = await request
        .post('/users')
        .set({ ...jsonHeaders, Authorization: token })
        .send(newUser);
      expect(response.status).toBe(200);
      const decodedUser: User = (jwt_decode(response.body) as DecodedJWT).user;
      expect(decodedUser.first_name).toEqual(createdUser.first_name);
      expect(decodedUser.last_name).toEqual(createdUser.last_name);
      expect(decodedUser.id).toEqual(createdUser.id);
      expect(decodedUser.user_name).toEqual(createdUser.user_name);
      expect(decodedUser.password).toBeUndefined();
    });

    it('user can create a product', async () => {
      const response = await request
        .post('/products')
        .set({ ...jsonHeaders, Authorization: token })
        .send(product);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...product, id: 1 });
      product = { ...product, id: 1 };
    });

    it('user can create an order', async () => {
      const response = await request
        .post('/orders')
        .set({ ...jsonHeaders, Authorization: token })
        .send(order);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...order, id: 1 });
      order = { ...order, id: 1 };
    });
  });
  describe('User routes test', () => {
    it('user get orders of a user', async () => {
      const response = await request
        .get('/users/1/orders')
        .set({ ...jsonHeaders, Authorization: token });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toEqual(order.id);
      expect(response.body[0].status).toEqual(order.status);
      expect(response.body[0].user_id).toEqual(order.user_id);
    });
  });

  describe('Product routes test', () => {
    it('user can get all products', async () => {
      const response = await request
        .get('/products')
        .set({ ...jsonHeaders, Authorization: token });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toEqual(product.id);
      expect(response.body[0].name).toEqual(product.name);
      expect(response.body[0].price).toEqual(product.price);
    });
    it('user can get specific products', async () => {
      const response = await request
        .get('/products/1')
        .set({ ...jsonHeaders, Authorization: token });
      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(product.id);
      expect(response.body.name).toEqual(product.name);
      expect(response.body.price).toEqual(product.price);
    });
  });

  describe('Order routes test', () => {
    it('user can add a product to an order', async () => {
      const response = await request
        .post(`/orders/${order.id}`)
        .set({ ...jsonHeaders, Authorization: token })
        .send({ product_id: product.id, quantity: 20 });
      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.order_id).toEqual(order.id);
      expect(response.body.product_id).toEqual(product.id);
      expect(response.body.quantity).toEqual(20);
    });
    it('user can edit order status', async () => {
      const response = await request
        .patch(`/orders/${order.id}`)
        .set({ ...jsonHeaders, Authorization: token })
        .send({ status: 'complete' });
      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(order.id);
      expect(response.body.user_id).toEqual(order.user_id);
      expect(response.body.status).toEqual('complete');
    });

    it('user cannot add a product to a completed order', async () => {
      //same request in te first route but order is now complete
      const response = await request
        .post(`/orders/${order.id}`)
        .set({ ...jsonHeaders, Authorization: token })
        .send({ product_id: product.id, quantity: 20 });
      expect(response.status).toBe(400);
    });
  });
});
