DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VarCHAR(45) NOT NULL,
  department_name VarCHAR(45) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  stock_quantity INT NOT NULL
);
   
INSERT INTO products (product_name, department_name, price, stock_quantity )
VALUES ('Dancing Elmo','Health and Household',4.99,10), ('Elmo Goes Potty','Childrens Books',9.66,2)

