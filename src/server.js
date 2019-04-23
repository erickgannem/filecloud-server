const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const server = require("http").Server(app);
const io = require("socket.io")(server);

const authRoutes = require("./routes/auth");
const errorHandler = require("./handlers/error");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/files");
const verificationTokenRoutes = require("./routes/token");

app.use(cors());

io.on("connection", socket => {
  socket.on("connectRoom", folder => {
    socket.join(folder);
  });
});
app.use((req, res, next) => {
  req.io = io;
  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/users/:user_id/folders/:folder_id",
  express.static(path.resolve(__dirname, "..", "tmp"))
);
app.use(authRoutes);
app.use(verificationTokenRoutes);
app.use(folderRoutes);
app.use(fileRoutes);

app.use(function(req, res, next) {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use(errorHandler);

server.listen(PORT, console.log(`Running at: ${process.env.URL}${PORT}`));
