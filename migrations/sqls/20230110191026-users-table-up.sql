/* Replace with your SQL commands */
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE Not NULL,
  password VARCHAR(255) Not NULL
);