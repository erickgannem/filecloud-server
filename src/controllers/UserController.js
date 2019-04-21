const db = require("../models");
const jwt = require("jsonwebtoken");
const sendgridMail = require("@sendgrid/mail");
const crypto = require("crypto");

class User {
  async signup(req, res, next) {
    try {
      const user = await db.User.create(req.body);
      const { _id, username, email, password } = user;
      const token = jwt.sign(
        { _id, username, email, password },
        process.env.SECRET_KEY
      );

      const verificationToken = await db.Token.create({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex")
      });
      if (verificationToken) {
        sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
          to: email,
          from: "no-reply@filecloud.com",
          subject: "Your account verification token",
          text: `Please verify your account by following this link: ${
            process.env.URL
          }${process.env.PORT}/api/token/confirmation/${
            verificationToken.token
          }`
        };
        await sendgridMail.send(message);
      }
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
      }).populate("folders", { _id: true, title: true, files: true });
      if (foundUser) {
        const passwordMatches = await foundUser.comparePassword(
          req.body.password
        );

        const { _id, username, email, password, folders } = foundUser;

        if (passwordMatches) {
          if (foundUser.isVerified) {
            const token = jwt.sign(
              { _id, username, email, password, folders },
              process.env.SECRET_KEY
            );
            return res
              .status(200)
              .json({ _id, username, token, email, password, folders });
          } else {
            return next({
              status: 400,
              message: "This user is not verified yet"
            });
          }
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
