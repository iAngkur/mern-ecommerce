const createHttpError = require("http-errors");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
  try {
    const options = {
      password: 0,
    };
    // Currently it only works for User model.
    // const item = await User.findById(id, options);

    const item = await Model.findById(id, options);

    if (!item) {
      throw createHttpError(
        404,
        `${Model.modelName} doesn't exist with this id: ${id}`
      );
    }

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(
        404,
        `${Model.modelName} doesn't exist with this id: ${id}`
      );
    } else {
      throw error;
    }
  }
};

module.exports = { findWithId };
