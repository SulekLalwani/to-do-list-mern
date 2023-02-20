const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost/to-do-list-mern");

const taskSchema = new mongoose.Schema({
  tasks: [String],
});

const Tasks = mongoose.model("tasks", taskSchema);

app.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.findOne();
    res.json({ tasks: tasks.tasks });
  } catch {
    sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  try {
    if (req.body.newTask && req.body.newTask.length > 0) {
      await Tasks.updateOne({ $push: { tasks: req.body.newTask } });
      res.sendStatus(202);
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.put("/", async (req, res) => {
  try {
    const tasksSize = (await Tasks.findOne()).tasks.length;
    if (
      req.body.taskToEdit >= 0 &&
      req.body.taskToEdit < tasksSize &&
      req.body.edit &&
      req.body.edit.length > 0
    ) {
      await Tasks.updateOne({
        $set: { [`tasks.${req.body.taskToEdit}`]: req.body.edit },
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.delete("/", async (req, res) => {
  try {
    const tasksSize = (await Tasks.findOne()).tasks.length;
    if (req.body.taskToDelete >= 0 && req.body.taskToDelete < tasksSize) {
      await Tasks.updateOne({
        $unset: { [`tasks.${req.body.taskToDelete}`]: "" },
      });
      await Tasks.updateOne({ $pull: { tasks: null } });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.listen(5000);
