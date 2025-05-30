import logger from "../utils/logger.js";

export const logoutUser = (req, res) => {
    const userId = req.user ? req.user.id : 'Unknown (no token?)'; // Get user ID if authenticated
    logger.info(`Logout requested for user ID: ${userId}`);
    res.json({ message: 'Logout successful. Please discard your token.' });
  }; 
  