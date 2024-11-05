const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { missingDataError } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());

app.use("/", routes);
app.use((req, res) => {
  res
    .status(missingDataError)
    .send({ message: "Requested resource not found" });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
