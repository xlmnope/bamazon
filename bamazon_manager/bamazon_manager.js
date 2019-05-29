var mysql = require("mysql");
var inquirer = require("inquirer");
availableproducts = [];

var connection = mysql.createConnection({
  host: "Localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Password123",
  database: "bamazon"
});

//


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  promptQuestion();

});




function promptQuestion() {
  inquirer.prompt({
    name: "manageroptions",
    type: "list",
    message: "Hi what would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
  }).then(handleAnswer);

}

function handleAnswer(val) {
  switch (val.manageroptions) {
    case "View Products for Sale":
      viewProducts();
      break;
    case "View Low Inventory":
      viewLowInventory();
      break;
    case "Add to Inventory":
      addToInventoryQ();
      break;
    case "Add New Product":
        askNewProduct();
      break;
    default:
      console.log("Goodbye!");
      process.exit(0);
      break;
  }
}
//View Products for Sale`, the app should list every available 
//item: the item IDs, names, prices, and quantities.


function viewProducts(answer) {
  // console.log("view products function");
  var query = "SELECT * FROM products"
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        i + 1 + ".)  " +
        "Product Name: " +
        res[i].product_name + "\n" +
        " ||  Category: " +
        res[i].department_name + "\n" +
        " ||  Price: " +
        res[i].price + "\n" +
        " ||  ID: " +
        res[i].item_id + "\n" +
        " ||  QUANTITITY: " +
        res[i].stock_quantity + "\n"
      );
    }
    promptQuestion();
  });
}

//* If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function addToInventoryQ() {
  var listofitems = [];
  var query = "SELECT product_name FROM products"
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      listofitems.push(res[i].product_name);
    };
    inquirer.prompt([{
      name: "addtoinventoryq",
      type: "list",
      message: "Which item would you like to add more of?",
      choices: listofitems
    },
    {
      type: "number",
      name: "quantity",
      message: "How many of this item would you like to add?",
      
    }]).then(addToInventoryLoadCurrentAmt);
  });
}

function addToInventoryLoadCurrentAmt(val) {
  console.log("======== addToInventoryLoadCurrent========");
  console.log("val: ", val);
  console.log("val.addtoinventoryq ", val.addtoinventoryq);
  var additionalquantity = val.quantity;
  var productname = val.addtoinventoryq;
  console.log("additionalquantity", additionalquantity);
  console.log("productname: ", productname);
  var query = "SELECT stock_quantity FROM products WHERE ?"
  connection.query(query,  { product_name: productname }, function (err, res) {
    if (err) throw err;
    // console.log("res: ",res)
    // console.log("res stock quant", res[0].stock_quantity)
    var existingquantity = res[0].stock_quantity;
    // console.log("existingquant: ", existingquantity);
    calculateNewQuantity(existingquantity, additionalquantity, productname);
  });
}
  
  

function calculateNewQuantity(existingquantity, additionalquantity, productname) {
  // console.log("=====calculateNewQuantity========");
  // console.log("product name: ", productname);
  // console.log("additional quantity: ", additionalquantity);
  // console.log("existingquantity: ", existingquantity);
  var newquantity = additionalquantity + existingquantity;
  //console.log("newquantity: ", newquantity)
  addToInventory(additionalquantity, newquantity, productname);
}

function addToInventory(additionalquantity, newquantity, productname) {
  // console.log("=======addToInventory=========");
  // console.log("additional quant: ", additionalquantity);
  // console.log("new quant: ", newquantity);
  // console.log("productname ", productname);
  connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newquantity
      },
      {
        product_name: productname
      }
    ],
    function (err) {
      if (err){
        console.log("Oops! There has been an error updating the quantity");
        throw err;
      }
      else {
        console.log(additionalquantity, "of ", productname, "has been added. There are now ", newquantity, "of ", productname, ".");
        promptQuestion();
      }

    }
  );
}



//* If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function askNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What is the name of the new product you would like to add?"
      },
      {
        type: "input",
        name: "department_name",
        message: "Which department does this product fall into?"
      },
      {
        type: "number",
        name: "price",
        message: "What is the price of this product?" 

      },
      {
        type: "number",
        name: "quantity",
        message: "How many of this item would you like to add?",
      }
    ])
    .then(addNewProduct);
}

// Adds a new product to the database, then asks original manager action questions
function addNewProduct(val) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    [val.product_name, val.department_name, val.price, val.quantity],
    function(err, res) {
      if (err) {
        console.log("Oops! There was an error adding this product")
        throw err;
      }
      console.log(val.product_name + " has been added! \n");
      //restart app
      promptQuestion();
    }
  );
}

function viewLowInventory() {
  console.log("view low inventory function");
  var query = "SELECT * FROM products WHERE stock_quantity<5"
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        i + 1 + ".)  " +
        "Product Name: " +
        res[i].product_name + "\n" +
        " ||  Category: " +
        res[i].department_name + "\n" +
        " ||  Price: " +
        res[i].price + "\n" +
        " ||  ID: " +
        res[i].item_id + "\n" +
        " ||  QUANTITITY: " +
        res[i].stock_quantity + "\n"
      );
    }
    promptQuestion();
})
}



