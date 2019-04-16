const jwt = require("jsonwebtoken");

module.exports = {
  loginRequired: async function(req, res, next) {
    try {
      const [type, token] = req.headers.authorization.split(" ");
      jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (decoded) {
          return next();
        } else {
          return next({
            status: 401,
            message: "Please, log in first"
          });
        }
      });
    } catch (err) {
      return next({
        status: 401,
        message: "Verification token doesn't exist. Please, try to log in first"
      });
    }
  },
  verifyCorrectUser: async function(req, res, next) {
    try {
      const [type, token] = req.headers.authorization.split(" ");
      jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (decoded && decoded._id === req.params.user_id) {
          return next();
        } else {
          return next({
            status: 400,
            message: "Unauthorized"
          });
        }
      });
    } catch (err) {
      return next(err);
    }
  }
};
