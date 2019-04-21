const db = require("../models");
const crypto = require("crypto");
const sendgridMail = require("@sendgrid/mail");

class TokenController {
  async confirmation(req, res, next) {
    try {
      const foundToken = await db.Token.findOne({
        token: req.params.verification_token
      });
      const foundUser = await db.User.findById(foundToken._userId);
      foundUser.isVerified = true;
      await foundUser.save();
      return res
        .status(200)
        .json({ message: `${foundUser.email} has been verified succesfully` });
    } catch (err) {
      next({
        status: 400,
        message: "User has been verificated, please log in"
      });
    }
  }
  async resend(req, res, next) {
    try {
      const foundUser = await db.User.findOne({ email: req.params.email });
      if (!foundUser) {
        next({
          status: 400,
          message: "We couldn't find a user with that email"
        });
      }
      const newToken = db.Token.create({
        _userId: foundUser._id,
        token: crypto.randomBytes(16).toString("hex")
      });

      sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
      const message = {
        to: email,
        from: "no-reply@filecloud.com",
        subject:
          "Filecloud - The verification token you've request has arrived",
        text: `Please verify your account by following this link: ${
          process.env.URL
        }${process.env.PORT}/api/token/confirmation/${newToken.token}`
      };
      await sendgridMail.send(message);
      return res.status(200).json({
        message: `A brand new verification token has been sent to ${
          foundUser.email
        }`
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new TokenController();
