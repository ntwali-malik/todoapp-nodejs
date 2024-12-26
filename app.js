const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Task = require("./models/task")

const app = express();
const PORT = 3000

app.use(bodyParser.json())
app.use(cors())

//Connection to mongoDB

mongoose.connect("mongodb://127.0.0.1:27017/todo-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Could not connect to MongoDB:", error))

// Get all task
app.get("/task",async(req,res) => {
    try {
        const task = await Task.find()
        res.json(task)
    } catch (error) {
        res.status(500).json({message: "Error fetching task"})
    }
})

//Create new task

app.post("/tasks",async(req,res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).json(task)
    } catch (error) {
        res.status(400).json({message :"Error creating task"})
    }
})


// Update task

app.put("/tasks/:id", async(req,res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true  // This ensures update validates against your schema
            }
        );
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        console.log(error);  // Add logging to see the actual error
        res.status(400).json({message: "Error updating task"});
    }
})

app.delete("/task/:id",async(req,res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(204).send()
    } catch (error) {
        res.status(400).json({message: "Error deleting task"})
    }
})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})