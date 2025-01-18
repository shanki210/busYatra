const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json("Access Denied: No Token Provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (user && user.isAdmin) {
      req.user = user; // Add user to request object
      next();
    } else {
      res.status(403).json("Access Denied: Not an Admin");
    }
  } catch (error) {
    res.status(400).json("Invalid Token");
  }
};

module.exports = adminMiddleware;
