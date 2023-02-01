const express = require("express");

const app = express();

const tasks = ["Task 1", "Task 2", "Task 3"];

app.get("/", (req, res) => {
  res.json({ tasks: tasks });
});

app.listen(5000);
