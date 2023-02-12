const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost/to-do-list-mern");

const taskSchema = new mongoose.Schema({
  tasks: [String],
});

const Tasks = mongoose.model("tasks", taskSchema);

app.get("/", (req, res) => {
  Tasks.findOne().then((tasks) => {
    res.json({ tasks: tasks.tasks });
  });
});

app.post("/", (req, res) => {
  if (req.body.newTask.length > 0) {
    Tasks.updateOne({ $push: { tasks: req.body.newTask } }).then(() => {
      res.sendStatus(202);
    });
  } else {
    res.sendStatus(400);
  }
});

app.delete("/", (req, res) => {
  Tasks.updateOne({ $unset: { [`tasks.${req.body.taskToDelete}`]: "" } }).then(
    () => {
      Tasks.updateOne({ $pull: { tasks: null } }).then(() => {
        res.sendStatus(200);
      });
    }
  );
});

app.put("/", (req, res) => {
  if (req.body.edit.length > 0) {
    Tasks.updateOne({
      $set: { [`tasks.${req.body.taskToEdit}`]: req.body.edit },
    }).then(() => {
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(5000);
