import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function searchProviders(req, res) {
  const { name, specialty } = req.query;

  try {
    let baseQuery = `
      SELECT u.id AS user_id, u.first_name, u.last_name, u.email, u.profile_image_url,
             p.id AS provider_id, p.specialty, p.bio, p.rating
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;

    const conditions = [];
    const values = [];

    if (name) {
      conditions.push(`(u.first_name ILIKE $${values.length + 1} OR u.last_name ILIKE $${values.length + 1})`);
      values.push(`%${name}%`);
    }

    if (specialty) {
      conditions.push(`p.specialty ILIKE $${values.length + 1}`);
      values.push(`%${specialty}%`);
    }

    if (conditions.length > 0) {
      baseQuery += " AND " + conditions.join(" AND ");
    }

    baseQuery += " ORDER BY u.first_name, u.last_name";

    const result = await query(baseQuery, values);

    res.status(200).json({ providers: result.rows });
  } catch (error) {
    logger.error("Error searching providers:", error);
    res.status(500).json({ message: "Failed to search providers", error: error.message });
  }
}
