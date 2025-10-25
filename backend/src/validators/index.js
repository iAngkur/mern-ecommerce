const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/responseController");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }
  next();
};

module.exports = runValidation;
