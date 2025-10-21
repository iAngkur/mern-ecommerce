const { seedUser } = require("../controllers/seedUserController");

const seedRouter = require("express").Router();

seedRouter.get("/users", seedUser);

module.exports = seedRouter;
