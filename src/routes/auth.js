const routes = require("express").Router();
const UserController = require("../controllers/UserController");

// https://localhost:3030/api/users/signup
routes.post("/api/users/signup", UserController.signup);
routes.post("/api/users/signin", UserController.signin);
module.exports = routes;
