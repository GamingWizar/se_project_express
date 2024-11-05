const router = require("express").Router();
const users = require("./users");
const clothingItems = require("./clothingItems");

const {
  validateAuthentication,
  validateUserInfo,
} = require("../middlewares/validation");

const { login, createUser } = require("../controllers/users");

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/users", users);
router.use("/items", clothingItems);

module.exports = router;
