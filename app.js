const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const itemsSchema = {
    name: String
};
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todo list"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    
    Item.find((err, results) => {
        
        if (err) {
            console.log(err);
        } else {
            if (results.length === 0) {
                Item.insertMany([item1, item2, item3], (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Berhasil menambahkan data");
                    }
                })
                res.redirect("/");
            } else {
                res.render("list", {
                    title: "Today",
                    listItem: results
                });
            }
        }
    })
})

app.get("/work", (req, res) => {
    res.render("list", {
        title: "Work List",
        listItem: workItems
    });
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.post("/", (req, res) => {
    console.log(req.body);
    if(req.body.button === "Work List"){
        workItems.push(req.body.newItem);
        res.redirect("/work");
    }else{
        items.push(req.body.newItem);
        res.redirect("/");
    }
})

app.listen("4000", () => {
    console.log("Server is running on port: 4000");
});