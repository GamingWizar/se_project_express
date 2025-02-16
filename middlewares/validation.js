const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl field must be filled in',
      "string.uri": 'The "imageUrl field must be a valid url',
    }),
    weather: Joi.string().required().valid("cold", "warm", "hot").messages({
      "string.empty": 'The "weather field must be filled in',
      "string.valid":
        'The "weather field must be either, "cold", "warm", or "hot"',
    }),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar field must be filled in',
      "string.uri": 'The "avatar field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email field must be filled in',
      "string.email": 'The "email field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password field must be filled in',
    }),
  }),
});

module.exports.validateUserUpdateInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar field must be filled in',
      "string.uri": 'The "avatar field must be a valid url',
    }),
  }),
});

module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email field must be filled in',
      "string.email": 'The "email field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "itemId" field must be 24 characters long',
      "string.hex": 'The "itemId" field must be a hexadecimal string',
      "string.empty": 'The "itemId" field must be filled in',
    }),
  }),
});
