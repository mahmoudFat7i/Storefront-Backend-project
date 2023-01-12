import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

export type OrderProduct = {
  id?: number;
  quantity: number;
  product_id: number;
  order_id: number;
};

export class OrderStore {
  async create(o: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [o.status, o.user_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not create new order to user : ${o.user_id} . Error: ${
          (err as Error).message
        }`
      );
    }
  }

  async addProduct(
    quantity: number,
    productId: number,
    orderId: number
  ): Promise<OrderProduct> {
    try {
      const ordersql = 'SELECT * FROM orders where id=$1';
      const conn = await Client.connect();
      const result = await conn.query(ordersql, [orderId]);

      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    }
    try {
      const sql =
        'INSERT INTO order_products (quantity,order_id,product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity,orderId,productId]);

      const order: OrderProduct = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product : ${productId} to order ${orderId} :${
          (err as Error).message
        }`
      );
    }
  }

  async getUserOrders(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders where user_id=$1';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  async setOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
      const result = await conn.query(sql, [status, id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not update  order ${id} . Error: ${(err as Error).message}`
      );
    }
  }
}
