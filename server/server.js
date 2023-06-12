const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret-key",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/to-do-list-mern",
      stringify: false,
    }),
  })
);

mongoose.connect("mongodb://localhost/to-do-list-mern");

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  tasks: Array,
});

const User = mongoose.model("users", userSchema);

function authenticate(req, res, next) {
  if (req.session.username) {
    req.username = req.session.username;
    next();
  } else {
    res.sendStatus(401);
  }
}

app.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username });
    res.status(200).json({ tasks: user.tasks });
  } catch {
    sendStatus(500);
  }
});

app.post("/", authenticate, async (req, res) => {
  try {
    if (req.body.newTask && req.body.newTask.length > 0) {
      await User.updateOne(
        { username: req.username },
        { $push: { tasks: req.body.newTask } }
      );
      res.sendStatus(201);
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.put("/", authenticate, async (req, res) => {
  try {
    if (req.body.taskToEdit >= 0 && req.body.edit && req.body.edit.length > 0) {
      await User.updateOne(
        { username: req.username },
        {
          $set: { [`tasks.${req.body.taskToEdit}`]: req.body.edit },
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

app.delete("/", authenticate, async (req, res) => {
  try {
    if (req.body.taskToDelete >= 0) {
      await User.updateOne(
        { username: req.username },
        { $unset: { [`tasks.${req.body.taskToDelete}`]: "" } }
      );
      await User.updateOne(
        { username: req.username },
        { $pull: { tasks: null } }
      );
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
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      username: username,
      passwordHash: passwordHash,
    });
    res.sendStatus(201);
  } else {
    res.status(400).send(messages);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username: username });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    req.session.username = username;
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.delete("/logout", authenticate, (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.sendStatus(200);
});

app.listen(5000);
