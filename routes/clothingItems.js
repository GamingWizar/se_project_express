const router = require("express").Router();

const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  getclothingItems,
  createClothingItem,
  deleteClothingItem,
  addClothingItemLike,
  removeClothingItemLike,
} = require("../controllers/clothingItems");

router.get("/", getclothingItems);
router.use(auth);
router.post("/", validateClothingItem, createClothingItem);
router.delete("/:itemId", validateId, deleteClothingItem);

router.put("/:itemId/likes", validateId, addClothingItemLike);
router.delete("/:itemId/likes", validateId, removeClothingItemLike);

module.exports = router;
