import { query } from "../config/db.js";
import logger from "../utils/logger.js";

/**
 * Search for providers by name or specialty.
 */
export async function searchProviders(req, res) {
  const { q } = req.query; // use `q` as the unified search term

  try {
    // Base SQL query to join providers and users
    let baseQuery = `
      SELECT u.id AS user_id, u.first_name, u.last_name, u.email, u.profile_image_url,
             p.id AS provider_id, p.specialty, p.bio, p.rating
      FROM providers p
      JOIN users u ON p.user_id = u.id
    `;

    const values = [];
    // If a search term is provided, add WHERE clause for partial matches

    if (q) {
      baseQuery += `
        WHERE u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR p.specialty ILIKE $1
      `;
      values.push(`%${q}%`);
    }

    // Order results alphabetically by first and last name

    baseQuery += " ORDER BY u.first_name, u.last_name";

    // Execute the query
    const result = await query(baseQuery, values);

    // Return the matching providers
    res.status(200).json({ providers: result.rows });
  } catch (error) {
    logger.error("Error searching providers:", error);
    res
      .status(500)
      .json({ message: "Failed to search providers", error: error.message });
  }
}
