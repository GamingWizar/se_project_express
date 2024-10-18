const ClothingItem = require("../models/clothingItem");

module.exports.getclothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send({ data: clothingItems });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      res.status(500).send(`SERVER ERROR: ${err}`);
    });
};
