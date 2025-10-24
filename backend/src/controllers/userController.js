const createHttpError = require("http-errors");
const User = require("../models/User");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/userService");
const { deleteImage } = require("../helpers/deleteImage");
const { generateToken, verifyToken } = require("../helpers/jwtProvider");
const { sendEmailWithNodeMail } = require("../helpers/sendEmail");

const userController = {
  processRegister: async (req, res, next) => {
    try {
      const { name, email, password, phone, address, image } = req.body;

      const existing = await User.exists({ email });

      if (existing) {
        throw createHttpError(
          409,
          "User with this email already exists. Please login instead."
        );
      }

      // create jwt token and send email

      const newUser = {
        name,
        email,
        password,
        phone,
        address,
      };

      const token = generateToken(
        newUser,
        process.env.JWT_ACTIVATION_SECRET,
        "15m"
      );

      // Prepare email
      const emailData = {
        email,
        subject: "Account Activation Link",
        html: `<h1>Hello, ${name}</h1>
               <h3>Please use the following link to activate your account</h3>
               <a href="${process.env.CLIENT_URL}/users/activate/${token}" target="_blank">ACTIVATION LINK</a>
               <hr />
               <p>This email may contain sensitive information</p>
               <p>${process.env.CLIENT_URL}</p>`,
      };

      // sendEmailWithNodeMail(emailData);

      return successResponse(res, {
        statusCode: 200,
        message: "Please check your email to activate your account",
        payload: { token },
      });
    } catch (error) {
      next(error);
    }
  },

  verifyUser: async (req, res, next) => {
    const { token } = req.params;
    try {
      const decoded = verifyToken(token, process.env.JWT_ACTIVATION_SECRET);
      if (!decoded) {
        throw createHttpError(401, "Invalid or expired token");
      }
      const { name, email, password, phone, address } = decoded;
      const existing = await User.exists({ email });
      if (existing) {
        throw createHttpError(
          409,
          "User with this email already exists. Please login instead."
        );
      }
      const newUser = new User({
        name,
        email,
        password,
        phone,
        address,
      });

      await newUser.save();

      return successResponse(res, {
        statusCode: 201,
        message: "User registered successfully",
        payload: {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const pageNumber = Number(req.query.page) || 1;
      if (pageNumber < 0) {
        throw createHttpError(400, "Invalid page number");
      }

      const itemsPerPage = Number(req.query.limit) || 5;
      if (itemsPerPage <= 0) {
        throw createHttpError(400, "Invalid number of items per page");
      }

      const itemsSkip = (pageNumber - 1) * itemsPerPage;

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
        .limit(itemsPerPage)
        .sort({ _id: 1 });

      if (!users) {
        throw createHttpError(404, "No users found");
      }

      const totalPages = Math.ceil(count / itemsPerPage);

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
    const options = { password: 0 };
    try {
      const user = await findWithId(User, userId, options);

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
      const user = await findWithId(User, userId);

      const userImgPath = user.image;

      deleteImage(userImgPath);

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
