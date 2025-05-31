import { pool } from "../config/db.js";
export async function getNotifications(req, res, next) {

    const userId = req.user.id

    try {
        const getNotificationsQuery = `SELECT id, type,message, data, is_read, created_at
                                       FROM  notifications
                                       WHERE user_id = $1
                                       ORDER BY created_at DESC
                                       `
        const getNotificationsQueryResult = pool.query(getNotificationsQuery, userId)

        return res.status(200).json({notificatios: getNotificationsQueryResult.rows})

    } catch(error) {
        res.status(500).json({ error: `Failed to fetch notifications. ${error}` });
    }
}

// Get unread notifications
export async function getUnReadNotifications(req, res, next){
  const userId = req.user.id;

  try {const getunReadNotificationsQuery = `SELECT id, type,message, data, is_read, created_at
                                       FROM  notifications
                                       WHERE user_id = $1 AND is_read = FALSE
                                       ORDER BY created_at DESC
                                       `
        const getunReadNotificationsQueryResult = pool.query(getunReadNotificationsQuery, userId)

    if (getunReadNotificationsQueryResult.rows.length === 0) {
      const err = new Error('No unread notifications found.')
      err.status = 404
      return next(err)
    }

    res.json({unreadNotifications: getunReadNotificationsQueryResult.rows});
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read." });
  }
};
