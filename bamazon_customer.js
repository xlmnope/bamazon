var mysql = require("mysql");
var inquirer = require("inquirer");
availableproducts =[];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "tigger*8",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showitems();
  
});

function showitems(){
    connection.query("SELECT product_name, price, item_id, department_name FROM products WHERE stock_quantity>0;", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        availableproducts.push(res[i].product_name);
        console.log(
          i+1 + ".)  " +
            "Product Name: " +
            res[i].product_name +"\n" +
            " ||  Category: " +
            res[i].department_name + "\n"+
            " ||  Price: " +
            res[i].price + "\n" //+
            //" ||  ID: "  +
            //res[i].item_id   +"\n" 
        );
      }
      promptQuestion();
    });
  };
  


function promptQuestion(){
  inquirer.prompt({
    name: "nameofProduct",
    type: "list",
    message: "Which product would you like to buy?",
    choices: availableproducts
  }).then(checkStock) 
  
}
function checkStock(answer){
  var productname = answer.nameofProduct;
  //checkstock
  var query = "SELECT stock_quantity, price FROM products WHERE ?"
  connection.query(query, { product_name: answer.nameofProduct }, function(err, res) {
    if (err) throw err;
    var price = res[0].price;
    if (res[0].stock_quantity > 0) {
        promptuserAmount(res[0].stock_quantity, price, productname);
    }
  });
}

function promptuserAmount(itemamount, price, productname){
    inquirer.prompt({
      name: "amountPurchase",
      type: "input",
      message: "How many would you like to purchase? We have " + itemamount +" available.",
    }).then(function (action) {  handleAmount(action, itemamount, price, productname);})   
}

function handleAmount(answer, itemamount, price, productname){
  console.log("Price: "+price);
if (answer.amountPurchase > itemamount) {
  console.log("sorry, we don't have enough of that item. We have " + itemamount + " of that item.");
  promptuserAmount(productname);
}
if (answer.amountPurchase <= itemamount) {
  
  var totalpurchasecost = price * answer.amountPurchase
  var newquantity = itemamount - answer.amountPurchase ;
  // show the customer the total cost of their purchase.
  console.log("Total cost: " + totalpurchasecost);
  // update SQL database to reflect the remaining quantity.
  updateProduct(newquantity, productname);
}
}

function updateProduct(newquantity, productname) {
  connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newquantity
      },
      {
        product_name: productname
      }
    ],
    function(err) {
      if (err) throw err;
  
    }
  );
  anotherPurchaseQ(productname);
  
    }
    
function anotherPurchaseQ(productname){
    inquirer.prompt({
    name: "anotherPurchase",
    type: "confirm",
    message: "Thank you for your purchase of " +productname + "! Would you like to make another purchase?",
  }).then(function (action) {  handleAnsw(action);})
}

function handleAnsw(action){
  if (action.anotherPurchase){
    promptQuestion();
  }
  if (!action.anotherPurchase){
    console.log("Have a good day!")
    connection.end();
  }
}
  
  

