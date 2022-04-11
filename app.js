const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var tasks = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, function(){
    console.log("The server is running on port 3000!");
});

app.get("/", function(req, res){
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit"
    };
    var date = new Date();
    var currentDay = date.toLocaleDateString("en-US", options);

    res.render("list", {currentDay: currentDay, tasks: tasks});
});

app.post("/", function(req, res){
    var newTask = req.body.newTask;
    console.log(newTask);
    tasks.push(newTask);

    res.redirect("/");
});