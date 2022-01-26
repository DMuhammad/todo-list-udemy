const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const items = ["Bangun Tidur", "Mandi", "Sholat Subuh"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    const day = today.toLocaleDateString("id-ID", options);

    res.render("list", {
        title: day,
        listItem: items
    });
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