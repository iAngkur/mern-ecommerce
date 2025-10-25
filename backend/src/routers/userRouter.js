const userController = require("../controllers/userController");
const upload = require("../middlewares/updateFile");
const runValidation = require("../validators");
const { validateUserRegistration } = require("../validators/authValidator");

const userRouter = require("express").Router();

userRouter.get("/", userController.getUsers);
userRouter.post(
  "/process-register",
  upload.single("image"),
  validateUserRegistration,
  runValidation,
  userController.processRegister
);
userRouter.get("/activate/:token", userController.verifyUser);
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", userController.updateUserById);
userRouter.delete("/:id", userController.deleteUserById);

module.exports = userRouter;
