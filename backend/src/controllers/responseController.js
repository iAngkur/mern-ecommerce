const errorResponse = (
  res,
  { statusCode = 500, message = "Internal server error. Try later." }
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const successResponse = (
  res,
  { statusCode = 200, message = "Operation success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    payload,
  });
};

module.exports = { errorResponse, successResponse };
