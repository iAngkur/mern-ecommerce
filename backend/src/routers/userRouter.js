const userController = require("../controllers/userController");
const upload = require("../middlewares/updateFile");

const userRouter = require("express").Router();

userRouter.get("/", userController.getUsers);
userRouter.post(
  "/process-register",
  upload.single("image"),
  userController.processRegister
);
userRouter.get("/activate/:token", userController.verifyUser);
userRouter.get("/:id", userController.getUserById);
userRouter.delete("/:id", userController.deleteUserById);

module.exports = userRouter;
