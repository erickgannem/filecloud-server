const routes = require("express").Router();
const FolderController = require("../controllers/FolderController");
const { loginRequired, verifyCorrectUser } = require("../middleware/auth");

routes.get(
  `/api/users/:user_id/folders`,
  loginRequired,
  verifyCorrectUser,
  FolderController.showAll
);

routes.get(
  `/api/users/:user_id/folders/:folder_id`,
  loginRequired,
  verifyCorrectUser,
  FolderController.showOne
);

routes.post(
  `/api/users/:user_id/folders`,
  loginRequired,
  verifyCorrectUser,
  FolderController.create
);

module.exports = routes;
