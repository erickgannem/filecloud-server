const routes = require("express").Router();
const FileController = require("../controllers/FileController");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { loginRequired, verifyCorrectUser } = require("../middleware/auth");

routes.post(
  `/api/users/:user_id/folders/:folder_id/files`,
  loginRequired,
  verifyCorrectUser,
  multer(multerConfig).single("file"),
  FileController.upload
);

module.exports = routes;
