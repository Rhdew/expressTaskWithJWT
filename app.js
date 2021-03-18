require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("./routing");

const app = express();
app.use(bodyParser.json());
app.use("/user", user);

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    reconnectTries: 3,
    reconnectInterval: 500,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Link established to database");
  })
  .catch((err) => {
    console.log("No link to database.", err);
  });
app.listen(3000, () => {
  console.log("connected ");
});
