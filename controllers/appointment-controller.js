import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function providerCancelAppointment(req, res) {
  const { providerId, appointmentId } = req.params;

  try {
    // 1. Fetch the appointment
    const findAppointmentQuery = `
      SELECT provider_id, timeslot_id, status
      FROM appointments
      WHERE id = $1
    `;
    const appointmentResult = await query(findAppointmentQuery, [
      appointmentId,
    ]);

    if (appointmentResult.rows.length === 0) {
      logger.warn(`Cancel failed: Appointment ${appointmentId} not found`);
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = appointmentResult.rows[0];

    // 2. Verify this appointment really belongs to the provider
    if (appointment.provider_id !== providerId) {
      logger.warn(
        `Unauthorized cancel attempt: Provider ${providerId} tried to cancel appointment ${appointmentId}`
      );
      return res
        .status(403)
        .json({ message: "You are not allowed to cancel this appointment" });
    }

    if (appointment.status === "canceled") {
      logger.warn(
        `Cancel failed: Appointment ${appointmentId} already canceled`
      );
      return res
        .status(409)
        .json({ message: "Appointment is already canceled" });
    }

    // 3. Cancel the appointment
    const cancelAppointmentQuery = `
      UPDATE appointments
      SET status = 'canceled'
      WHERE id = $1
      RETURNING *
    `;
    const canceledResult = await query(cancelAppointmentQuery, [appointmentId]);

    // 4. Free up the time slot
    const freeSlotQuery = `
      UPDATE time_slots
      SET is_booked = FALSE
      WHERE id = $1
    `;
    await query(freeSlotQuery, [appointment.timeslot_id]);

    logger.info(
      `Appointment ${appointmentId} canceled successfully by provider ${providerId}`
    );


    const io = req.app.get("io");

    await io.to(appointment.provider_id).emit("appointment_canceled", {
      message: "An appointment was canceled",
      appointmentId: appointmentId,
    });
    logger.info(`🔔 Notification sent to provider ${appointment.provider_id}`);

    await io.to(appointment.client_id).emit("appointment_canceled", {
      message: "Your appointment was canceled",
      appointmentId: appointmentId,
    });
    logger.info(`🔔 Notification sent to provider ${appointment.client_id}`);


    res.json({
      message: "Appointment canceled successfully",
      appointment: canceledResult.rows[0],
    });
  } catch (error) {
    logger.error(
      `Error canceling appointment ${appointmentId} by provider ${providerId}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Failed to cancel appointment", error: error.message });
  }
}

export async function cancelAppointment(req, res) {
  const userId = req.user.id;
  const { appointmentId } = req.params;

  try {
    // 1. Fetch the appointment
    const findAppointmentQuery = `
        SELECT client_id, provider_id, timeslot_id, status
        FROM appointments
        WHERE id = $1
      `;
    const appointmentResult = await query(findAppointmentQuery, [
      appointmentId,
    ]);

    if (appointmentResult.rows.length === 0) {
      logger.warn(`Cancel failed: Appointment ${appointmentId} not found`);
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = appointmentResult.rows[0];

    // 2. Check if user is authorized
    if (
      appointment.client_id !== userId &&
      appointment.provider_id !== userId
    ) {
      logger.warn(`Cancel failed: Unauthorized user ${userId}`);
      return res
        .status(403)
        .json({ message: "You are not allowed to cancel this appointment" });
    }

    if (appointment.status === "canceled") {
      logger.warn(
        `Cancel failed: Appointment ${appointmentId} already canceled`
      );
      return res
        .status(409)
        .json({ message: "Appointment is already canceled" });
    }

    // 3. Cancel the appointment
    const cancelAppointmentQuery = `
        UPDATE appointments
        SET status = 'canceled'
        WHERE id = $1
        RETURNING *
      `;
    const canceledResult = await query(cancelAppointmentQuery, [appointmentId]);

    // 4. Free up the time slot
    const freeSlotQuery = `
        UPDATE time_slots
        SET is_booked = FALSE
        WHERE id = $1
      `;
    await query(freeSlotQuery, [appointment.time_slot_id]);

    logger.info(`Appointment ${appointmentId} canceled by user ${userId}`);

    const io = req.app.get("io");

    await io.to(appointment.provider_id).emit("appointment_canceled", {
      message: "An appointment was canceled",
      appointmentId: appointmentId,
    });
    logger.info(`🔔 Notification sent to provider ${appointment.provider_id}`);

    await io.to(appointment.client_id).emit("appointment_canceled", {
      message: "Your appointment was canceled",
      appointmentId: appointmentId,
    });
    logger.info(`🔔 Notification sent to provider ${appointment.client_id}`);

    res.json({
      message: "Appointment canceled successfully",
      appointment: canceledResult.rows[0],
    });
  } catch (error) {
    logger.error(`Error canceling appointment ${appointmentId}:`, error);
    res
      .status(500)
      .json({ message: "Failed to cancel appointment", error: error.message });
  }
}

export async function viewProviderAppointments(req, res) {
  const providerId = req.params.id;

  try {
    const providerAppointmentsQuery = `
      SELECT a.id AS appointment_id, a.status, a.created_at,
             t.day, t.start_time, t.end_time,
             c.first_name AS client_first_name,
             c.last_name AS client_last_name
      FROM appointments a
      JOIN time_slots t ON a.timeslot_id = t.id
      JOIN clients c ON a.client_id = c.id
      WHERE a.provider_id = $1
      ORDER BY t.day, t.start_time
    `;

    const appointmentsResult = await query(providerAppointmentsQuery, [
      providerId,
    ]);

    res.json({ appointments: appointmentsResult.rows });
  } catch (error) {
    logger.error(
      `Error fetching appointments for provider ${providerId}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch provider appointments",
      error: error.message,
    });
  }
}

export async function viewMyAppointments(req, res) {
  const clientId = req.user.id;

  try {
    const myAppointmentsQuery = `
      SELECT a.id AS appointment_id, a.status, a.created_at,
             t.day, t.start_time, t.end_time,
             p.first_name AS provider_first_name,
             p.last_name AS provider_last_name
      FROM appointments a
      JOIN time_slots t ON a.timeslot_id = t.id
      JOIN providers p ON a.provider_id = p.id
      WHERE a.client_id = $1
      ORDER BY t.day, t.start_time
    `;

    const appointmentsResult = await query(myAppointmentsQuery, [clientId]);

    res.json({ appointments: appointmentsResult.rows });
  } catch (error) {
    logger.error(`Error fetching appointments for client ${clientId}:`, error);
    res
      .status(500)
      .json({ message: "Failed to fetch appointments", error: error.message });
  }
}

export async function bookAppointment(req, res) {
  const clientId = req.user.id; // Extract from token, not URL

  try {
    const { timeslotId } = req.body;
    // 1. Check if time slot exists and is available
    const timeSlotQuery = `SELECT * FROM time_slots WHERE id = $1`;
    const timeSlotResult = await query(timeSlotQuery, [timeslotId]);

    if (timeSlotResult.rows.length === 0) {
      logger.warn(
        `Booking error: Time slot with id ${timeslotId} does not exist`
      );
      return res.status(404).json({ message: "Time slot not found" });
    }

    const slot = timeSlotResult.rows[0];

    if (slot.is_booked === true) {
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
      status,
    ]);

    // 4. Mark the time slot as booked
    const updateSlotQuery = `UPDATE time_slots SET is_booked = TRUE WHERE id = $1`;
    await query(updateSlotQuery, [timeslotId]);

    logger.info(
      `Appointment successfully booked for client ${clientId} on slot ${timeslotId}`
    );

    const io = req.app.get("io"); // Get io instance

   await io.to(providerId).emit("new_appointment", {
      message: "You have a new appointment booked!",
      appointment: appointmentResult.rows[0],
    });

    logger.info(`🔔 Notification sent to provider ${providerId}`);
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: appointmentResult.rows[0],
    });
  } catch (error) {
    logger.error(`Error booking appointment for client ${clientId}:`, error);
    res.status(500).json({
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
}
