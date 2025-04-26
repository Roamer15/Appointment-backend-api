import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function bookAppointment(req, res) {
  const clientId = req.user.id; // Extract from token, not URL
 

  try {
    const { timeslotId } = req.body;
    // 1. Check if time slot exists and is available
    const timeSlotQuery = `SELECT * FROM time_slots WHERE id = $1`;
    const timeSlotResult = await query(timeSlotQuery, [timeslotId]);

    if (timeSlotResult.rows.length === 0) {
      logger.warn(`Booking error: Time slot with id ${timeslotId} does not exist`);
      return res.status(404).json({ message: "Time slot not found" });
    }

    const slot = timeSlotResult.rows[0];

    if (slot.is_booked) {
      logger.warn(`Booking error: Time slot ${timeslotId} is already booked`);
      return res.status(409).json({ message: "Time slot already booked" });
    }

    // 2. Extract appointment data
    const appointmentDate = slot.day;
    const providerId = slot.provider_id;
    const status = "booked";

    // 3. Create appointment
    const insertAppointmentQuery = `
      INSERT INTO appointments (client_id, provider_id, timeslot_id, ppointment_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const appointmentResult = await query(insertAppointmentQuery, [
      clientId,
      providerId,
      timeslotId,
      appointmentDate,
      status
    ]);

    // 4. Mark the time slot as booked
    const updateSlotQuery = `UPDATE time_slots SET is_booked = TRUE WHERE id = $1`;
    await query(updateSlotQuery, [timeslotId]);

    logger.info(`Appointment successfully booked for client ${clientId} on slot ${timeslotId}`);

    res.status(201).json({ message: "Appointment booked successfully", appointment: appointmentResult.rows[0] });

  } catch (error) {
    logger.error(`Error booking appointment for client ${clientId}:`, error);
    res.status(500).json({ message: "Server error while booking appointment", error: error.message });
  }
}
