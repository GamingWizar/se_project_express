const router = require("express").Router();

const {
  getclothingItems,
  createClothingItem,
  deleteClothingItem,
  addClothingItemLike,
  removeClothingItemLike,
} = require("../controllers/clothingItems");

router.get("/", getclothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);

router.put("/:itemId/likes", addClothingItemLike);
router.delete("/:itemId/likes", removeClothingItemLike);

module.exports = router;
