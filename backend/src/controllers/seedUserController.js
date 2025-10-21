const { users: userData } = require("../data");
const User = require("../models/User");

const seedUser = async (req, res, next) => {
  try {
    // deleting all existing users
    await User.deleteMany({});

    // inserting new users
    const users = await User.insertMany(userData);

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
