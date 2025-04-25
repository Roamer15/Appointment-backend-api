import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function providerOnly(req, res, next) {
  try {
    const providerId = req.params?.id;
    logger.info(providerId)
    const result = await query(
      `SELECT id FROM providers WHERE id = $1`,
      [providerId]
    );

    if (result.rows.length === 0) {
      logger.warn(`Access denied: User ID ${providerId} is not a provider`);
      return res.status(403).json({ message: "Access restricted to providers" });
    }

    logger.debug(`Access granted: Provider ID ${providerId}`);
    next();
  } catch (error) {
    logger.error(`Error checking provider status:`, error);
    res
      .status(500)
      .json({ message: "Server error while verifying provider access" });
  }
}
