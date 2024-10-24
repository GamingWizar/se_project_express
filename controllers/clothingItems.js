const ClothingItem = require("../models/clothingItem");
const {
  defaultServerError,
  invalidDataError,
  missingDataError,
  invalidPermissionsError,
} = require("../utils/errors");

module.exports.getclothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send({ data: clothingItems });
    })
    .catch(() => {
      res
        .status(defaultServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid data passed" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.name = "MissingItemError";
      error.statusCode = missingDataError;
      throw error;
    })
    .then((item) => {
      if (req.user._id === item.owner.toString()) {
        ClothingItem.findByIdAndRemove(req.params.itemId)
          .then((clothingItem) => {
            res.send({ data: clothingItem });
          })
          .catch(() => {
            res
              .status(defaultServerError)
              .send({ message: "An error has occurred on the server." });
          });
      } else {
        res
          .status(invalidPermissionsError)
          .send({ message: "Invalid Permission" });
      }
    })
    .catch((err) => {
      if (err.name === "MissingItemError") {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.addClothingItemLike = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
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
      if (err.name === "MissingItemError") {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.removeClothingItemLike = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
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
      if (err.name === "MissingItemError") {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid ID" });
      } else {
        res
          .status(defaultServerError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
