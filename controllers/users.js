const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { jwtKey } = require("../utils/config");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

module.exports.createUser = (req, res, next) => {
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
            next(new BadRequestError("Invalid data passed"));
          } else if (err.name === "MongoServerError") {
            next(new ConflictError("Email already in use"));
          } else {
            next(err);
          }
        });
    });
  } else {
    next(new BadRequestError("Invalid data passed"));
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Password and email required"));
  } else {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, jwtKey, { expiresIn: "7d" });
        res.send({ token });
      })
      .catch(next);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(() => {
      throw new NotFoundError("User ID not found");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User ID not found");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data passed"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};
