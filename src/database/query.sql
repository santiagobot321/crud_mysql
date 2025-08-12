CREATE DATABASE expertsoft;

USE expertsoft;

CREATE TABLE transactions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_tra date,
    hour_tra time,
    amount int,
    status_tra enum('Pending', 'Failed', 'Completed'),
    type_tra enum('Bill payment', 'Deposit', 'Withdrawal')
);

CREATE TABLE clients(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Number_ID int UNIQUE NOT NULL,
    name_client text,
    last_client text,
    address_client VARCHAR(50),
    phone_number VARCHAR(50),
    email VARCHAR(50)
);


CREATE TABLE bills(
    bill_number int PRIMARY KEY,
    platform enum('Daviplata', 'Nequi'),
    period_bill date,
    invoiced_amount int,
    amount_paid int
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);