const BadRequestError = require("./customErrors/BadRequestError");
const UnauthorizedError = require("./customErrors/UnauthorizedError");
const ForbiddenError = require("./customErrors/ForbiddenError");
const NotFoundError = require("./customErrors/NotFoundError");
const ConflictError = require("./customErrors/ConflictError");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
