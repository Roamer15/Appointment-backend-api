import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function ratingHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const { providerId, appointmentId, rating, comment } = req.body;

    const verifyProviderQuery = `SELECT * FROM providers WHERE id = $1`;
    const verifyProviderResult = await query(verifyProviderQuery, providerId);

    if (verifyProviderResult.rows.length === 0) {
      const err = new Error("Provider not found,");
      err.status = 404;
      return next(err);
    }

    const verifyAppointmentQuery = `SELECT * FROM appointments WHERE id = $1`;
    const verifyAppointmentResult = await query(
      verifyAppointmentQuery,
      appointmentId
    );

    if (verifyAppointmentResult.rows.length === 0) {
      const err = new Error(`Appointment doesn't exist`);
      err.status = 404;
      return next(err);
    }

    const checkDuplicateQuery = `SELECT * FROM ratings WHERE appointment_id = $1 AND user_id = $2`;
    const duplicateResult = await query(checkDuplicateQuery, [
      appointmentId,
      userId,
    ]);
    if (duplicateResult.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "You have already rated this appointment." });
    }

    const insertRatingQuery = `INSERT INTO ratings (appointment_id, user_id, provider_id, rating, comment)
                               VALUES ($1, $2, $3, $4, $5)
                               RETURNING *`;

    const insertRatingResult = await query(insertRatingQuery, [
      appointmentId,
      userId,
      providerId,
      rating,
      comment,
    ]);

    logger.info(`Rating successfully stored`);
    const ratingResult = insertRatingResult.rows;

    res.status(201).json({
      message: "Thanks for for rating",
      rating: ratingResult,
    });
  } catch (error) {
    logger.error(`Registration error for ${email}:`, error);
    next(error);
  }
}
