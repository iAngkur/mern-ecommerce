const createHttpError = require("http-errors");
const User = require("../models/User");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/userService");
const fs = require("fs");

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const pageNumber = Number(req.query.page) || 1;
      if (pageNumber < 0) {
        throw createHttpError(400, "Invalid page number");
      }

      const itemsPerpage = Number(req.query.limit) || 5;
      if (itemsPerpage <= 0) {
        throw createHttpError(400, "Invalid number of items per page");
      }

      const itemsSkip = (pageNumber - 1) * itemsPerpage;

      const searchRegExp = new RegExp(".*" + search + ".*", "i");

      const filter = {
        isAdmin: { $ne: true },
        $or: [
          { name: { $regex: searchRegExp } },
          { email: { $regex: searchRegExp } },
          { phone: { $regex: searchRegExp } },
        ],
      };

      const options = {
        password: 0,
      };

      const count = await User.find(filter).countDocuments();

      const users = await User.find(filter, options)
        .skip(itemsSkip)
        .limit(itemsPerpage)
        .sort({ _id: 1 });

      if (!users) {
        throw createHttpError(404, "No users found");
      }

      const totalPages = Math.ceil(count / itemsPerpage);

      return successResponse(res, {
        statusCode: 200,
        message: "Users fetched successfully",
        payload: {
          users,
          pagination: {
            totalPages,
            currentPage: pageNumber,
            nextPage: pageNumber + 1 <= totalPages ? pageNumber + 1 : null,
            previousPage:
              pageNumber - 1 > 0
                ? pageNumber - 1 > totalPages
                  ? totalPages
                  : pageNumber - 1
                : null,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await findWithId(userId);

      return successResponse(res, {
        statusCode: 200,
        message: "User fetched successfully",
        payload: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUserById: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await findWithId(userId);

      const userImgPath = user.image;

      if (!isDefaultImage(userImgPath)) {
        fs.access(userImgPath, (err) => {
          if (err) {
            throw createHttpError(400, "Failed to read image");
          } else {
            fs.unlink(userImgPath, (err) => {
              if (err) {
                throw err;
              }
            });
          }
        });
      }

      return successResponse(res, {
        statusCode: 200,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
