const jwt = require("jsonwebtoken");
const { jwtKey } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
};
