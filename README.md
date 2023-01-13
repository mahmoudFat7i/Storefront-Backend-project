# Storefront-Backend-project

Udacity Storefront Backend project

## Getting Started

- To get started, clone this repo and run `yarn or npm i` in your terminal at the project root.

- please check out config file at src\lib\config.ts .

- you have to create two databases with the value you set in POSTGRES_DB, POSTGRES_TEST_DB, this is an example for the SQL needed when connected to psql
  `CREATE USER shopping_user WITH PASSWORD 'password123'; CREATE DATABASE shopping; \c shopping GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user; CREATE DATABASE shopping_test; \c shopping_test GRANT ALL PRIVILEGES ON DATABASE shopping_test TO shopping_user;`

## Overview

### 1. DB Creation and Migrations

- to run migrations up on dev environment run `npm run test-up`, to run migrations down it run `npm run resetdb`
- to run migrations up on test environment run `npm run test-up`, to run migrations down it run `npm run resetdb`
- to create a new migration run :db-migrate create store --sql-file

### 2. API endpoints

- check requirments.md

### 3. Authentication

- on user creation or succesful authentication, user is provided a token, make sure to add this as a bearer token in authorization for routes that require authentication to work correctly

### 4. QA and `README.md`

- to run tests for database run `npm run test-db`
- to run tests for routes run `npm run test-routes`

### 5. local host ports

-for the database, port is not specified so it will run on the selected port for postgres installation (default is 5432)
-server is running on port 3000
