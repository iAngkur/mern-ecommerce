const userController = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.delete("/:id", userController.deleteUserById);

module.exports = userRouter;
