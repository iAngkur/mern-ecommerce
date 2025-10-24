const createHttpError = require("http-errors");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      createHttpError(
        400,
        "Invalid file type. Only JPEG, PNG and GIF are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE) || 2097152,
  },
  fileFilter,
});

module.exports = upload;
