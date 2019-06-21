const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

io.on("connection", socket => {
  socket.on("userSession", userId => {
    socket.join(userId);
  });
});
app.use((req, res, next) => {
  req.io = io;
  return next();
});

server.listen(PORT, console.log(`Running on port: ${PORT}`));
