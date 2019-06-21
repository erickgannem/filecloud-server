const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const errorHandler = require("./handlers/error");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/files");
const verificationTokenRoutes = require("./routes/token");

dotenv.config();

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(morgan("tiny"));
    this.express.use(cors());
  }
  routes() {
    this.express.use(
      "/api/users/:user_id/folders/:folder_id",
      express.static(path.resolve(__dirname, "..", "tmp"))
    );
    this.express.use(authRoutes);
    this.express.use(verificationTokenRoutes);
    this.express.use(folderRoutes);
    this.express.use(fileRoutes);
    this.express.use(function(req, res, next) {
      const error = new Error("Not Found");
      error.status = 404;
      next(error);
    });
    this.express.use(errorHandler);
  }
}

module.exports = new AppController().express;
