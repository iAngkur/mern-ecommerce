const { body } = require("express-validator");

// Registration and login input validation using
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name must be between 3 and 31 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  //   body("image").optional().isString().withMessage("Image must be a string"),

  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        return false;
      }

      return true;
    })
    .withMessage("Image is required"),
];

module.exports = { validateUserRegistration };
