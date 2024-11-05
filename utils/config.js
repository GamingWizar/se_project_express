const { JWT_SECRET = "Azir" } = process.env;

module.exports = {
  jwtKey: JWT_SECRET,
};
