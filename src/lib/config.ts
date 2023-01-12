import dotenv from 'dotenv';
dotenv.config();

const config = {
  POSTGRES_HOST: process.env.POSTGRES_HOST || '127.0.0.1',
  POSTGRES_DB: process.env.POSTGRES_HOST || 'storefront_dev',
  POSTGRES_TEST_DB: process.env.POSTGRES_HOST || 'storefront_test',
  POSTGRES_USER: process.env.POSTGRES_HOST || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_HOST || 'postgres',
  NODE_ENV: process.env.POSTGRES_HOST || 'dev',
  BCRYPT_PASSWORD: process.env.POSTGRES_HOST || 'your hash password',
  SALT_ROUNDS: process.env.POSTGRES_HOST || 3,
  TOKEN_SECRET: process.env.POSTGRES_HOST || 'mySecret'
};

export default config;
