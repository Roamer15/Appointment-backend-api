import { pool } from "../config/db.js";

/**
 * Get all notifications for the logged-in user.
 * Returns notifications ordered by most recent first.
 */
export async function getNotifications(req, res, next) {
  const userId = req.user.id;

  try {
    const getNotificationsQuery = `
      SELECT id, type, message, data, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    // Await the query and pass userId as an array
    const getNotificationsQueryResult = await pool.query(getNotificationsQuery, [userId]);

    // Return notifications as JSON
    return res.status(200).json({ notifications: getNotificationsQueryResult.rows });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch notifications. ${error}` });
  }
}

/**
 * Get all unread notifications for the logged-in user.
 * Returns unread notifications ordered by most recent first.
 */
export async function getUnReadNotifications(req, res, next) {
  const userId = req.user.id;

  try {
    const getunReadNotificationsQuery = `
      SELECT id, type, message, data, is_read, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
      ORDER BY created_at DESC
    `;
    // Await the query and pass userId as an array
    const getunReadNotificationsQueryResult = await pool.query(getunReadNotificationsQuery, [userId]);

    // If no unread notifications, return 404
    if (getunReadNotificationsQueryResult.rows.length === 0) {
      const err = new Error('No unread notifications found.');
      err.status = 404;
      return next(err);
    }

    // Return unread notifications as JSON
    res.json({ unreadNotifications: getunReadNotificationsQueryResult.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread notifications." });
  }
}