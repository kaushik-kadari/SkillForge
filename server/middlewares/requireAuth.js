const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Requires Authorization: Bearer <jwt>.
 * Sets req.user = { name, email, ... } from the token payload.
 */
const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, config.SECRET_KEY);
    if (!decoded?.email) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAuth;
