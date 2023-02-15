const express = require("express");
const cors = require("cors");
const app = express().use(express.json());
app.use(cors());
let message = "";
const port = process.env.PORT;

app.listen(port, () => console.log("Server is up"));

app.post("/", (req, res) => {
  res.status(200).send({ message: message });
  message = "";
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "hello" });
  
});


app.post("/api/events", (req, res) => {
  console.log(req.body[0]);
  message = req.body[0] ? req.body[0].data : "Hello";
  res.status(200).send(message);
});
