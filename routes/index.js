const router = require("express").Router();
const users = require("./users");
const clothingItems = require("./clothingItems");

const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", users);
router.use("/items", clothingItems);

module.exports = router;
