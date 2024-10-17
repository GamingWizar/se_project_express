const User = require("..models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};
