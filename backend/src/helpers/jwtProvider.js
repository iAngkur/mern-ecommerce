const jwt = require("jsonwebtoken");

exports.generateToken = (payload, secret, expiresIn = "1h") => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("Payload is required to generate a token");
  }

  if (!secret) {
    throw new Error("Secret key is required to generate a token");
  }

  try {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  } catch (error) {
    throw error;
  }
};

exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
