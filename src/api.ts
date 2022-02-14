export {};

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header({
    "Access-Control-Allow-Methods": "GET, POST,  PUT, DELETE , OPTIONS",
  });
  next();
});
const users = require("./routes/user");

//const express = require("express");

//const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/users", users);

const corsOption = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOption));

app.listen(3300, () => {
  console.log("Server is now listening at port 3300");
});
