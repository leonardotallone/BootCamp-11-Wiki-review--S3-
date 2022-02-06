const express = require("express");
const app = express();
const volleyball = require("volleyball");
const routes = require("./routes");
const db = require("./db");

// logging middleware
app.use(volleyball);
app.use(express.static("build"));

// parsing middleware
app.use(express.json());
app.use("/api", routes);

app.use("/api", (req, res) => {
  res.sendStatus(404);
});

app.use((req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

// error middleware -> https://expressjs.com/es/guide/error-handling.html
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

db.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000, y DB sincronizada!"));
});
