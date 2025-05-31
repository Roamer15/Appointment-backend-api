import { pool } from "../config/db.js"

export default async function notifyUser({ io, rolePrefix, userId, type, message, data = {} }) {
     // Save to DB
  await pool.query(
    `INSERT INTO notifications (user_id, type, message, data)
     VALUES ($1, $2, $3, $4)`,
    [userId, type, message, JSON.stringify(data)]
  );

  // Emit to the correct room like 'provider_123'
  const room = `${rolePrefix}_${userId}`;
  io.to(room).emit(type, {
    message,
    data,
    createdAt: new Date().toISOString()
  });
}