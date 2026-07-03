const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("INvalid token");
    }

    const decodedObj = await jwt.verify(token, "DEVTinder@23");
    const { id } = decodedObj;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send(`Error ${err.message}`);
  }
};

module.exports = {
  userAuth,
};
