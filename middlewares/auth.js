const jwt = require("jsonwebtoken");
const { jwtKey } = require("../utils/config");

const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    next(new UnauthorizedError("Authorization required"));
  }
  req.user = payload;
  return next();
};
