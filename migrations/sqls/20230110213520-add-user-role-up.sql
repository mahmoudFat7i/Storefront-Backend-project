/* Replace with your SQL commands */
create type user_role as ENUM('user','admin');
alter table users add column role user_role not null default 'user';
