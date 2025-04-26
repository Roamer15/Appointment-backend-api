import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    logger.warn(`Auth middleware: no token provided`);
    return res.status(401).json({ message: 'No token, authorization has been denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- VERIFY, not decode

    // Set req.user depending on your payload structure
    req.user = decoded.user || decoded; // Fallback if not wrapped in user

    if (!req.user?.id) {
      throw new Error("Token payload missing user ID");
    }

    logger.debug(`Auth middleware: Token verified for Client ID ${req.user.id}`);
    next();
  } catch (error) {
    logger.error('Auth middleware: token verification failed', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token is expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token is not valid" });
    }
    return res.status(error.status || 500).json({ message: error.message || "Server error during token verification" });
  }
}

export default authMiddleware;
