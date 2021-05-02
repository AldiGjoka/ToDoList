//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });


const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Pershendetje"
});

const item2 = new Item({
  name: "Kliko butonin + per te shtuar."
});

const item3 = new Item({
  name: "<-- Kliko ketu per te fshire."
});

const defaultItems = [item1, item2, item3];




app.get("/", function (req, res) {
  Item.find({}, function (err, result) {
    if (defaultItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log("Error");
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "To Do List", newListItems: result });
    }
  });
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })
  item.save();

  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID, function(err){
    if(err){
      console.log("Error "+ checkedItemID );
    } else {
      console.log("Success");
      res.redirect("/");
    }
  })
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(5000, function () {
  console.log("Server started on port 5000");
});
