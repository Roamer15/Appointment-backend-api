import { pool } from "../config/db.js";
import logger from "../utils/logger.js";

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
    const getNotificationsQueryResult = await pool.query(
      getNotificationsQuery,
      [userId]
    );

    // Return notifications as JSON
    return res
      .status(200)
      .json({ notifications: getNotificationsQueryResult.rows });
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
      SELECT id, title, type, message, data, is_read, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
      ORDER BY created_at DESC
    `;
    // Await the query and pass userId as an array
    const getunReadNotificationsQueryResult = await pool.query(
      getunReadNotificationsQuery,
      [userId]
    );

    // Return unread notifications as JSON
    res.json({ unreadNotifications: getunReadNotificationsQueryResult.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread notifications." });
  }
}

export async function updateReadNotifications(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the notification exists and belongs to the user
    const checkQuery = `SELECT * FROM notifications WHERE id = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      const err = new Error("Notification not found or access denied.");
      err.status = 404;
      return next(err);
    }

    // Update the notification to read
    const updateToReadQuery = `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`;
    const updateToReadResult = await pool.query(updateToReadQuery, [id]);
    const updatedNotification = updateToReadResult.rows[0];

    if (!updatedNotification) {
      const err = new Error("Failed to update notification.");
      err.status = 500;
      return next(err);
    }

    // Log the update
    logger(`Notification ${id} marked as read by user ${userId}`);

    res.json({ notification: updatedNotification });
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    res.status(500).json({ error: "Failed to update notification." });
  }
}

/**
 * Mark all notifications as read for the logged-in user.
 */
export async function markAllNotificationsAsRead(req, res, next) {
  const userId = req.user.id;

  try {
    // Update all notifications for this user to is_read = TRUE
    const updateQuery = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [userId]);

    if (result.rowCount === 0) {
      return res
        .status(200)
        .json({ message: "No unread notifications to update." });
    }

    res.status(200).json({
      message: "All notifications marked as read.",
      updatedCount: result.rowCount,
      updatedNotifications: result.rows,
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    res
      .status(500)
      .json({ message: "Failed to mark all notifications as read." });
  }
}
