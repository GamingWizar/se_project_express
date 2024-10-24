const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  getclothingItems,
  createClothingItem,
  deleteClothingItem,
  addClothingItemLike,
  removeClothingItemLike,
} = require("../controllers/clothingItems");

router.get("/", getclothingItems);
router.use(auth);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);

router.put("/:itemId/likes", addClothingItemLike);
router.delete("/:itemId/likes", removeClothingItemLike);

module.exports = router;
