const express = require("express");
const EventEmitter = require("events");

const app = express();
const events = new EventEmitter();

events.on("requestReceived", (req) => {
  console.log("[REQUEST]", req.url);
});

app.use((req, res, next) => {
  events.emit("requestReceived", req);
  next();
});

app.listen(8080);
