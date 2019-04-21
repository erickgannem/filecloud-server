require("dotenv").config({
  path: require("path").resolve(__dirname, "..", ".devenv")
});
const mongoose = require("mongoose");

mongoose.Promise = Promise;
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${
    process.env.DB_PASSWORD
  }@ds233500.mlab.com:33500/filecloud-db`,
  {
    keepAlive: true,
    useNewUrlParser: true
  }
);

module.exports.User = require("./User");
module.exports.Folder = require("./Folder");
module.exports.File = require("./File");
module.exports.Token = require("./Token");
