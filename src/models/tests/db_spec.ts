import { User, UserStore } from './../user';
import { Product, ProductStore } from './../product';
import { Order, OrderProduct, OrderStore } from './../order';
import client from '../../database';

const oStore = new OrderStore();
const pStore = new ProductStore();
const uStore = new UserStore();
describe('User Model', () => {
  const newUser: User = {
    user_name: 'newUser123',
    first_name: 'testUser',
    last_name: 'lastName',
    password: 'testPassword'
  };

  const createdUser: User = { ...newUser, id: 1 };
  const newProduct: Product = {
    name: 'newproduct',
    price: 100
  };
  const createdProduct: Product = { ...newProduct, id: 1 };
  const newOrder: Order = {
    status: 'active',
    user_id: 1
  };
  const createdOrder: Order = { ...newOrder, id: 1 };
  const newOrderProduct: OrderProduct = {
    quantity: 20,
    order_id: createdOrder.id as number,
    product_id: createdProduct.id as number
  };

  describe('User Model', () => {
    it('should have a create method', () => {
      expect(uStore.create).toBeDefined();
    });
    it('should have an authenticate method', () => {
      expect(uStore.authenticate).toBeDefined();
    });
    it('create method should add a user', async () => {
      const result = await uStore.create(newUser);
      expect(result).toEqual(createdUser);
    });
    it('authenticate method should return the correct user', async () => {
      const result = (await uStore.authenticate(
        newUser.user_name,
        newUser.password
      )) as User;
      expect(result).toEqual(createdUser);
    });
  });

  describe('Product Model', () => {
    it('should have an index method', () => {
      expect(pStore.index).toBeDefined();
    });
    it('should have a show method', () => {
      expect(pStore.show).toBeDefined();
    });
    it('should have a create method', () => {
      expect(pStore.create).toBeDefined();
    });
    it('create method should add a product', async () => {
      const result = await pStore.create(newProduct);
      expect(result).toEqual(createdProduct);
    });

    it('index method should return a list of products', async () => {
      const result = await pStore.index();
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(createdProduct);
    });

    it('show method should return the correct product', async () => {
      const result = await pStore.show('1');
      expect(result).toEqual(createdProduct);
    });
  });

  describe('Order Model', () => {
    it('should have a create method', () => {
      expect(oStore.create).toBeDefined();
    });
    it('create method should add an order', async () => {
      const result = await oStore.create(newOrder);
      expect(result).toEqual(createdOrder);
    });
    it('addProduct method should return the new order product item', async () => {
      const result = await oStore.addProduct(
        newOrderProduct.quantity,
        newOrderProduct.order_id,
        newOrderProduct.product_id
      );
      expect(result.id).toEqual(1);
      expect(result.order_id).toEqual(newOrderProduct.order_id);
      expect(result.product_id).toEqual(newOrderProduct.product_id);
      expect(result.quantity).toEqual(newOrderProduct.quantity);
    });
    it('getUserOrders method should return a list of orders for this user', async () => {
      const result = await oStore.getUserOrders(createdUser.id as number);
      expect(result.length).toBe(1);
      expect(result[0].user_id).toEqual(createdOrder.user_id);
      expect(result[0].status).toEqual(createdOrder.status);
      expect(result[0].id).toEqual(createdOrder.id);
    });
    it('setOrderStatus method should update the order status', async () => {
      const result = await oStore.setOrderStatus(
        createdOrder.id as number,
        'complete'
      );
      expect(result.user_id).toEqual(createdOrder.user_id);
      expect(result.status).toEqual('complete');
      expect(result.id).toEqual(createdOrder.id);
    });
  });
});
