const fs = require("fs").promises;

isDefaultImage = (userImgPath) => {
  return userImgPath === process.env.DEFAULT_USER_IMAGE;
};

exports.deleteImage = async (imgPath) => {
  if (!isDefaultImage(userImgPath)) {
    try {
      await fs.access(imgPath);
      await fs.unlink(imgPath);
    } catch (error) {
      throw error;
    }
  }
};
