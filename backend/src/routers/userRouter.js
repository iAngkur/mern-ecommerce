const userController = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.get("/", userController.getUsers);

module.exports = userRouter;
