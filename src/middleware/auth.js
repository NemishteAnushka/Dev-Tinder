const userAuth = (req, res, next) => {
  const token = "abc";
  const isAuthenticated = token === "bc";

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("UnAuthorised");
  }
};

module.exports = {
  userAuth,
};
