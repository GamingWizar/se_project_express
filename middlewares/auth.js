const jwt = require("jsonwebtoken");
const { jwtKey } = require("../utils/config");

const { invalidAuthorizationError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(invalidAuthorizationError)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    return res
      .status(invalidAuthorizationError)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
};
