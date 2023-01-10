import dotenv from 'dotenv';
dotenv.config();
import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  username: string;
  password: string;
  role: string;
};
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${(err as Error).message}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find user ${id}. Error: ${(err as Error).message}`
      );
    }
  }

  async create(username: string, password: string): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (username,password) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(
        password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [username, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not create new user with title : ${username} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
  async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM USERS where username=$1;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();

      if (result.rowCount) {
        const user = result.rows[0] as User;
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(
        `Could not sign in user with username : ${username} . Error: ${
          (err as Error).message
        }`
      );
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      console.log(result);
      const numberOfDeletedRows = result.rowCount;

      conn.release();

      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
