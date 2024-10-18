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
    .catch((err) => {
      console.error(err);
      res
        .status(defaultServerError)
        .send("An error has occurred on the server.");
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
      console.error(err);
      if (err.name === "MissingUserError") {
        return res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        return res
          .status(defaultServerError)
          .send("An error has occurred on the server.");
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidDataError)
          .send({ message: "Invalid data passed" });
      } else {
        return res
          .status(defaultServerError)
          .send("An error has occurred on the server.");
      }
    });
};
