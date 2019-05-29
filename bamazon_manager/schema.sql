DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE listofoptions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  options VarCHAR(45) NOT NULL,
);
   
INSERT INTO listofoptions (options)
VALUES ('View Products for Sale, View Low Inventory, Add to Inventory, Add New Product')


