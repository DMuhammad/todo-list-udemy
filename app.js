const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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

app.get("/:customListName", (req, res) => {
    const topic = _.capitalize(req.params.customListName);
    List.findOne({name: topic}, (err, result) => {
        if(!err){
            if(!result){
                const list = new List({
                    name: topic,
                    items: [item1, item2, item3]
                });
                list.save();
                res.redirect(`/${topic}`);
            }else{
                res.render("list", {
                    title: result.name,
                    listItem: result.items
                })
            }
        }
    })
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listItem = req.body.button;

    const item = new Item({
        name: itemName
    });
    
    if(listItem === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listItem}, (err, result) => {
            if(!err){
                result.items.push(item);
                result.save();
                res.redirect(`/${listItem}`);
            }
        })
    }
})

app.post("/delete", (req, res) => {
    const itemId = req.body.check;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(itemId, err => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, result) => {
            if(!err){
                res.redirect(`/${listName}`);
            }else{
                console.log(err);
            }
        });
    }

})

app.listen("4000", () => {
    console.log("Server is running on port: 4000");
});