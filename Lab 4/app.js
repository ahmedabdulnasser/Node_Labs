const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const { v4: uuidv4 } = require("uuid");
const auth = require("./auth");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded());

app.post("/login", async (req, res) => {
  const user = await app.db
    .collection("users")
    .findOne({ username: req.body.username });

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    const sid = uuidv4();
    auth.sessions[sid] = user;
    console.log(auth.sessions);
    res.cookie("sid", sid);
    res.send({ message: "Success" });
  } else {
    res.status(401).send("Incorrect username or password.");
  }
});

app.post("/register", async (req, res) => {
  const user = await app.db.collection("users").findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (user) {
    if (user.username == req.body.username) {
      res.send({ message: "Username is taken." });
    } else if (user.email == req.body.email) {
      res.send({ message: "This email is used before." });
    }
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    app.db.collection("users").insertOne({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      role: "user",
    });
    res.send({ message: "Success" });
  }
});

app.get("/home", auth.checkAuth(["user", "admin"]), (req, res) => {
  res.send(`Welcome ${req.user.role} ${req.user.username}`);
});

app.get("/staff", auth.checkAuth(["admin"]), (req, res) => {
  res.send(`Welcome ${req.user.role} ${req.user.username} to sensitive info`);
});

async function main() {
  try {
    const db = await connectDB();
    app.db = db;
    const users = await app.db.collection("users").find().toArray();

    console.log("Server is now running at http://localhost:" + port);
    app.listen(3000);
  } catch (e) {
    console.error(e);
  }
}

main();
