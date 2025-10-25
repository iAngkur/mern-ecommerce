const createHttpError = require("http-errors");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.env.UPLOAD_DIRECTORY);
//   },
//   filename: function (req, file, cb) {
//     const extname = path.extname(file.originalname);
//     cb(
//       null,
//       Date.now() + "-" + file.originalname.replace(extname, "") + extname
//     );
//   },
// });

// Disk Image Upload Validation
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       createHttpError(
//         400,
//         "Invalid file type. Only JPEG, PNG and GIF are allowed."
//       ),
//       false
//     );
//   }
// };

// Buffer Image Upload Validation

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      createHttpError(400, "Invalid file type. Only image files are allowed."),
      false
    );
  }

  if (file.size > parseInt(process.env.MAX_FILE_UPLOAD_SIZE) || 2097152) {
    return cb(
      createHttpError(
        400,
        `File size exceeds the limit of ${
          parseInt(process.env.MAX_FILE_UPLOAD_SIZE) / 1024 / 1024 || 2
        } MB.`
      ),
      false
    );
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      createHttpError(
        400,
        "Invalid file type. Only JPEG, PNG and GIF are allowed."
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE) || 2097152,
  // },
  fileFilter,
});

module.exports = upload;
