const User = require("../models/user");
const {
  defaultServerError,
  invalidDataError,
  missingDataError,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(defaultServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "MissingUserError";
      error.statusCode = missingDataError;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "MissingUserError") {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid data passed" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
