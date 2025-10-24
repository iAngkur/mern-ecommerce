const { seedUser } = require("../controllers/seedUserController");

const seedRouter = require("express").Router();

seedRouter.post("/users", seedUser);

module.exports = seedRouter;
