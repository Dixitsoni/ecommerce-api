const jwt = require("jsonwebtoken");
const UserModel = require("../models/usermodel");

const authToken = (token) => {
  const encode = jwt.sign({ id: token }, process.env.JWT_SECRET);
  return encode;
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const role = req.body.role;

  if (!token && !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const getAutherizedUser = await UserModel.findById(decode.id);
  if (getAutherizedUser) {
    next();
    return;
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = { authToken, verifyToken };
