import { pool } from "../config/db.js"

export default async function notifyUser({ io, rolePrefix, userId, title, type, message, data = {} }) {
     // Save to DB
  await pool.query(
    `INSERT INTO notifications (user_id, title, type, message, data)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, title, type, message, JSON.stringify(data)]
  );

  // Emit to the correct room like 'provider_123'
  const room = `${rolePrefix}_${userId}`;
  io.to(room).emit(type, {
    message,
    data,
    createdAt: new Date().toISOString()
  });
}