const routes = require("express").Router();
const tokenController = require("../controllers/TokenController");

routes.get(
  "/api/token/confirmation/:verification_token",
  tokenController.confirmation
);
routes.post("/api/token/resend", tokenController.resend);

module.exports = routes;
