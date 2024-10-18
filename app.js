const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/users");
const clothingItems = require("./routes/clothingItems");
const {
  defaultServerError,
  invalidDataError,
  missingDataError,
} = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6712a09eff4694809ee22d27",
  };
  next();
});

app.use("/users", users);
app.use("/items", clothingItems);
app.use((req, res) => {
  res
    .status(missingDataError)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
