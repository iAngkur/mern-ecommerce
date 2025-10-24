const createHttpError = require("http-errors");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const findWithId = async (id, options = {}) => {
  try {
    const options = {
      password: 0,
    };
    const item = await User.findById(id, options);

    if (!item) {
      throw createHttpError(404, `No item found with this id: ${id}`);
    }

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(404, `No item found with this id: ${id}`);
    } else {
      throw error;
    }
  }
};

module.exports = { findWithId };
