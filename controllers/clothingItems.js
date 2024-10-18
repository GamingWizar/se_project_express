const ClothingItem = require("../models/clothingItem");
const {
  defaultServerError,
  invalidDataError,
  missingDataError,
} = require("../utils/errors");

module.exports.getclothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send({ data: clothingItems });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(defaultServerError)
        .send("An error has occurred on the server.");
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidDataError)
          .send({ message: "Invalid data passed" });
      } else {
        return res
          .status(defaultServerError)
          .send("An error has occurred on the server.");
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.name = "MissingItemError";
      error.statusCode = missingDataError;
      throw error;
    })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "MissingItemError") {
        return res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        return res
          .status(defaultServerError)
          .send("An error has occurred on the server.");
      }
    });
};
