const express = require("express");
const EventEmitter = require("events");
const fs = require("fs");

const app = express();
const events = new EventEmitter();
const logFilePath = __dirname + "/logs.txt";

app.use(express.static("public"));

events.on("requestReceived", (req) => {
  const date = new Date();
  fs.appendFile(
    logFilePath,
    `${date.toISOString().split("T")[0]} ${req.method} ${req.url} ${req.ip}\n`,
    (err) => {
      err ? console.error(err) : "";
    }
  );
});

app.use((req, res, next) => {
  events.emit("requestReceived", req);
  next();
});

app.get("/logs", (req, res) => {
  fs.readFile(logFilePath, "utf-8", (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading the file.");
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(content);
  });
});

if (!fs.existsSync(logFilePath)) {
  fs.writeFile(logFilePath, "", (err) => {
    console.error(err);
  });
}

app.listen(8080);
