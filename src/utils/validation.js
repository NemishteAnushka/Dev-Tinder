const validator = require("validator");

const getSignUpValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Not valid Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not strong password");
  }
};

module.exports = {
  getSignUpValidation,
};
