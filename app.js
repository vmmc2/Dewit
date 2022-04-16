const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

var tasks = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


const taskItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name of the task was not specified!"]
    }
});

const taskGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name of the task group was not specified!"]
    },
    tasks: [taskItemSchema]
});

const TaskItem = mongoose.model("TaskItem", taskItemSchema);

const TaskGroup = mongoose.model("TaskGroup", taskGroupSchema);



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

    console.log(tasks);
    res.render("list", {currentDay: currentDay, tasks: tasks});
});

app.post("/", function(req, res){
    var newTask = req.body.newTask;
    var taskGroup = req.body.taskGroup;
    
    if(!tasks.hasOwnProperty(taskGroup)){
        tasks[taskGroup] = [newTask];
    }else{
        tasks[taskGroup].push(newTask);
    }

    res.redirect("/");
});