// const path = require("path");
// require("dotenv").config({
//   path: path.resolve(__dirname, "..", ".devenv")
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const authRoutes = require("./routes/auth");
const errorHandler = require("./handlers/error");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/files");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/users/:user_id/folders/:folder_id",
  express.static(path.resolve(__dirname, "..", "tmp"))
);
app.use(authRoutes);
app.use(folderRoutes);
app.use(fileRoutes);

app.use(function(req, res, next) {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use(errorHandler);

app.listen(PORT, console.log(`Running on port: ${PORT}`));
