const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose.Promise = Promise;

if (process.env.NODE_ENV === "prod") {
  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@ds233500.mlab.com:33500/filecloud-db`,
    {
      keepAlive: true,
      useNewUrlParser: true
    }
  );
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
  mongoose.connect("mongodb://localhost:27017/test", {
    keepAlive: true,
    useNewUrlParser: true
  });
} else if (process.env.NODE_ENV === "dev") {
  dotenv.config({ path: ".env.dev" });
  mongoose.connect("mongodb://localhost:27017/fileclod-dev-db", {
    keepAlive: true,
    useNewUrlParser: true
  });
}

module.exports.User = require("./User");
module.exports.Folder = require("./Folder");
module.exports.File = require("./File");
module.exports.Token = require("./Token");
