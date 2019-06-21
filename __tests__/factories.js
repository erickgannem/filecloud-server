const { name, internet } = require("faker");

module.exports.generateUser = () => {
  const user = {
    username: name.findName(),
    email: internet.email(),
    password: internet.password()
  };
  return user;
};
