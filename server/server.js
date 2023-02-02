const express = require("express");

const app = express();

app.use(express.json());

const tasks = ["Task 1", "Task 2", "Task 3"];

app.get("/", (req, res) => {
  res.json({ tasks: tasks });
});

app.post("/", (req, res) => {
  tasks.push(req.body.newTask);
  res.sendStatus(202);
});

app.listen(5000);
