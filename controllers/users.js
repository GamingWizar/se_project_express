const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { jwtKey } = require("../utils/config");
const User = require("../models/user");

const {
  defaultServerError,
  invalidDataError,
  missingDataError,
  emailInUseError,
  invalidAuthorizationError,
} = require("../utils/errors");

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (password) {
    bcyrpt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.send({
            data: {
              name: user.name,
              avatar: user.avatar,
              email: user.email,
              _id: user._id,
            },
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            res
              .status(invalidDataError)
              .send({ message: "Invalid data passed" });
          } else if (err.name === "MongoServerError") {
            res
              .status(emailInUseError)
              .send({ message: "Email already in use" });
          } else {
            res
              .status(defaultServerError)
              .send({ message: "An error has occurred on the server." });
          }
        });
    });
  } else {
    res.status(invalidDataError).send({ message: "Invalid data passed" });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(invalidDataError)
      .send({ message: "Password and email required" });
  } else {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, jwtKey, { expiresIn: "7d" });
        res.send({ token });
      })
      .catch((err) => {
        if (err.message === "Incorrect email or password") {
          res.status(invalidAuthorizationError).send({ message: err.message });
        } else {
          res.status(invalidDataError).send({ message: err.message });
        }
      });
  }
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user)
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

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, avatar },
    { new: true, runValidators: true }
  )
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
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid data passed" });
      } else if (err.name === "MissingUserError") {
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
