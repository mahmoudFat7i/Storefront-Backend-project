/* Replace with your SQL commands */
alter table todos add column user_id INTEGER references users(id) not null;