import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (user_name,first_name,last_name,password) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [
        u.user_name,
        u.first_name,
        u.last_name,
        hash
      ]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not create new user : ${u.first_name} ${u.last_name} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
  async authenticate(
    user_name: string,
    password: string
  ): Promise<User | null> {
    try {
      const sql = `SELECT * FROM users where user_name='${user_name}'`;
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();

      if (result.rowCount) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(
        `Could not sign in user with username : ${user_name} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
}
