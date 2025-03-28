const express = require("express");
const app = express();
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const port = 3000;
const config = require("config");
const db = config.get("mongoURI");
const setupSocket = require("./util/socket");
const http = require("http");
const httpServer = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(routes);

mongoose
  .connect(db)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => console.error(err));

setupSocket(httpServer);

module.exports = { port: port };

httpServer.listen(port, () => {
  console.log("Server has started at http://localhost:" + port);
});
