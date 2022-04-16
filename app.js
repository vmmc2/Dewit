const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

var tasks = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

/* ------------------------------- Schemas ------------------------------ */
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

/* -------------------------------- Models ------------------------------ */
const TaskItem = mongoose.model("TaskItem", taskItemSchema);

const TaskGroup = mongoose.model("TaskGroup", taskGroupSchema);


/* ----------------------------- Documents ------------------------------ */
const taskItem1 = new TaskItem({
    name: "Welcome to DewIt! Here you can keep track of your daily tasks!"
});

const taskItem2 = new TaskItem({
    name: "You can add a new task to your list by giving it a name, putting it inside a task group and then hitting the + button in the form below!"
});

const taskItem3 = new TaskItem({
    name: "When you are done with a task and want to delete it, all you have to do is hit the X button inside the task group section!"
});

const defaultTaskItems = [taskItem1, taskItem2, taskItem3];

const defaultTaskGroup = new TaskGroup({
    name: "Default Task Group",
    tasks: defaultTaskItems
});

/*TaskItem.insertMany(defaultTaskItems, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Successfully inserted the default docume")
    }
});

defaultTaskGroup.save();*/

/* ----------------------------- Back-End Logic ------------------------------ */
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
    let taskGroups;

    TaskGroup.find({}, function(err, foundItems){
        taskGroups = foundItems;
        res.render("list", {currentDay: currentDay, taskGroups: taskGroups});
    });
});

app.post("/", function(req, res){
    let newTask = req.body.newTask;
    let taskGroupName = req.body.taskGroup;
    if(taskGroupName === ""){
        taskGroupName = "General";
    }

    TaskGroup.findOne({name: taskGroupName}, function(err, result){
        if(err){
            console.log(err);
        }else{
            if(result === null){ // TaskGroup nao existe.
                const taskItem = new TaskItem({
                    name: newTask
                });
                taskItem.save();
                const taskGroupItem = new TaskGroup({
                    name: taskGroupName,
                    tasks: [taskItem]
                });
                taskGroupItem.save();
            }else{ // TaskGroup existe.
                const taskItem = new TaskItem({
                    name: newTask
                });
                taskItem.save();
                result.tasks.push(taskItem);
                result.save();
            }
        }
    });

    res.redirect("/");
});