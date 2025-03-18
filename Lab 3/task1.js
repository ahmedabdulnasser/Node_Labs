const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("[REQUEST]:", req.url, "\n", "[HEADERS]:", req.headers);
  next();
});

app.get("/", (req, res) => {
  res.send("<h2>Homepage</h2>");
});
app.get("/contact", (req, res) => {
  res.send("<h2>Conatct me at +123 456 789</h2>");
});

app.listen(8080);
