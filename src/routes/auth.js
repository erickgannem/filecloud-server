const routes = require("express").Router();
const UserController = require("../controllers/UserController");

routes.post("/api/users/signup", UserController.signup);
routes.post("/api/users/signin", UserController.signin);

module.exports = routes;
