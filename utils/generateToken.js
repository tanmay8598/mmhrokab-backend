const jwt = require("jsonwebtoken");

const generateTokenAdmin = (id, name, email) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
const generateTokenUser = (id, name, email, subscriptionStatus) => {
  return jwt.sign(
    { id, name, email, subscriptionStatus },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = {
  generateTokenAdmin,
  generateTokenUser,
};
