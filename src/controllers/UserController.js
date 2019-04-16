const db = require("../models");
const jwt = require("jsonwebtoken");

class User {
  async signup(req, res, next) {
    try {
      const user = await db.User.create(req.body);
      const { _id, username, email, password } = user;
      const token = jwt.sign(
        { _id, username, email, password },
        process.env.SECRET_KEY
      );
      return res.status(200).json({ _id, username, email, password, token });
    } catch (err) {
      if (err.code === 11000) {
        err.message = "The email/username has been taken";
      }
      next(err);
    }
  }
  async signin(req, res, next) {
    try {
      const foundUser = await db.User.findOne({
        email: req.body.email
      }).populate("folders");
      if (foundUser) {
        const passwordMatches = await foundUser.comparePassword(
          req.body.password
        );
        const { _id, username, email, password, folders } = foundUser;

        if (passwordMatches) {
          const token = jwt.sign(
            { _id, username, email, password, folders },
            process.env.SECRET_KEY
          );
          return res
            .status(200)
            .json({ _id, username, email, password, folders, token });
        } else {
          return next({
            status: 400,
            message: "Incorrect Password"
          });
        }
      } else {
        return next({
          status: 400,
          message: "Wrong Email / User doesn't exist"
        });
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new User();
