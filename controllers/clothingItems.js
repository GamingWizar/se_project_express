const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

module.exports.getclothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send({ data: clothingItems });
    })
    .catch(next);
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data passed"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then((item) => {
      if (req.user._id === item.owner.toString()) {
        ClothingItem.findByIdAndRemove(req.params.itemId)
          .then((clothingItem) => {
            res.send({ data: clothingItem });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw new ForbiddenError("Invalid Permission");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};

module.exports.addClothingItemLike = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};

module.exports.removeClothingItemLike = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(err);
      }
    });
};
