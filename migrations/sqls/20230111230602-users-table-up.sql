/* Replace with your SQL commands */
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) Not NULL UNIQUE,
  first_name VARCHAR(255) Not NULL,
  last_name VARCHAR(255) Not NULL,
  password VARCHAR(255) Not NULL
);