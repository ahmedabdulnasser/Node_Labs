const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());

let cars = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/car-manager.html");
});

app.get("/cars", function (req, res) {
  res.send(cars);
});

app.get("/showcar", function (req, res) {
  const id = req.query.id;
  const idx = cars.findIndex((car) => car.id == id);
  return cars[idx];
});

app.get("/deletecar", function (req, res) {
  const id = req.query.id;
  cars = cars.filter((car) => car.id != id);
  res.send({ msg: `Deleted car ${id} successfully.` });
});

app.post("/addcar", function (req, res) {
  const car = { id: cars.length + 1, ...req.body };
  cars.push(car);
  console.log(cars);
  res.send({ msg: "Car added successfully." });
});

app.post("/editcar", function (req, res) {
  const id = req.body.id;
  console.log(req.body);
  const idx = cars.findIndex((car) => car.id == id);
  console.log(idx);
  if (idx > -1) {
    cars[idx] = { ...cars[idx], ...req.body };
    res.send({ msg: `Edited car ${id} successfully.` });
  } else {
    res.status(404).send({ msg: `Car ${id} not found.` });
  }
});

app.get("/clearcars", function (req, res) {
  cars = [];
  console.log(cars);
  res.send({ msg: "Cleared cars list." });
});

app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/css/style.css");
});

app.listen(8080);
