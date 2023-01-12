## API Endpoints

#### Authentication

- Authenticate (/Authenticate) [post]
  body: {user_name, password}

#### Products

- Index : /products [get]
- Show : /products/:id [get]
- Create [token required] : /products [post]
  body: {name,price}

#### Users

- Create [token required : /users[post]
  body: {user_name,,first_name,last_name, password}
- current order by user [token required]: /users/:id/orders [get]

#### Orders

- Create [token required] : /orders [post]
  body: {user_id}
- set status [token required] : /orders/:id [patch]
  body: {status}
- add product [token required] : /users/:id [post]
  body: {product_id, quantity}

## Data Shapes

#### Product

- id
- name
- price

#### User

- id
- firstName
- lastName
- username
- password

#### Orders

- id
- user_id
- status of order (active or complete)

#### order products

- id
- product id
- order id
- quantity of product

## database Schema

#### database tables

storefront_dev=# \dt
List of relations
Schema | Name | Type | Owner
--------+------------------+-------+----------
public | migrations | table | postgres
public | migrations_state | table | postgres
public | order_products | table | postgres
public | orders | table | postgres
public | products | table | postgres
public | users | table | postgres

#### user

storefront_dev=# \d users
id | integer | | not null | nextval('users_id_seq'::regclass)
user_name | character varying(255) | | not null |
first_name | character varying(255) | | not null |
last_name | character varying(255) | | not null |
password | character varying(255) | | not null |

#### products

storefront_dev=# \d products  
 id | integer | | not null | nextval('products_id_seq'::regclass)
name | character varying(255) | | not null |
price | integer | | not null |

#### orders

storefront_dev=# \d orders
id | integer | | not null | nextval('orders_id_seq'::regclass)
status | order_status | | not null |
user_id | integer | | not null |

#### order products

storefront_dev-# \d order_products
id | integer | | not null | nextval('order_products_id_seq'::regclass)
quantity | integer | | not null |
order_id | integer | | not null |
product_id | integer | | not null |
