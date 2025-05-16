import logger from "../utils/logger.js";

export function providerOnly(req, res, next) {
  if (req.user.role !== 'provider') {
    logger.error('Path is made for providers only')
    return res.status(403).json({ message: "Access denied: Providers only" });
  }
  next();
}
