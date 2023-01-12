/* Replace with your SQL commands */
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  status order_status Not NULL,
  user_id INTEGER REFERENCES users(id) Not NULL
); 