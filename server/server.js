const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

mongoose.connect("mongodb://localhost/to-do-list-mern");

const taskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("tasks", taskSchema);

const userSchema = new mongoose.Schema({ username: String, password: String });

const User = mongoose.model("users", userSchema);

app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ task: { $exists: true } });
    res.json({ tasks: tasks });
  } catch {
    sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  try {
    if (req.body.newTask && req.body.newTask.length > 0) {
      const createdTask = await Task.create({ task: req.body.newTask });
      res.status(202).send({ newTaskID: createdTask._id });
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.put("/", async (req, res) => {
  try {
    if (req.body.taskToEdit && req.body.edit && req.body.edit.length > 0) {
      await Task.updateOne(
        { _id: req.body.taskToEdit },
        {
          $set: { task: req.body.edit },
        }
      );
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
    if (req.body.taskToDelete) {
      await Task.deleteOne({ _id: req.body.taskToDelete });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const repeatedPassword = req.body.repeatedPassword;

  const messages = [];

  if (username.length < 3) {
    messages.push("Username is too short");
  }
  if (username.length > 15) {
    messages.push("Username is too long");
  }
  if (await User.findOne({ username: username })) {
    messages.push("Username is already taken");
  }
  if (password.length < 8) {
    messages.push("Password is too short");
  }
  if (password.length > 128) {
    messages.push("Password is too long");
  }
  if (password !== repeatedPassword) {
    messages.push("Passwords do not match");
  }

  if (messages.length == 0) {
    await User.create({
      username: username,
      password: password,
    });
    res.sendStatus(201);
  } else {
    res.status(400).send(messages);
  }
});

app.listen(5000);
