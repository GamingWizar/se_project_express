const router = require("express").Router();

const {
  getclothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getclothingItems);

router.post("/", createClothingItem);

router.delete("/:itemId", deleteClothingItem);

module.exports = router;
