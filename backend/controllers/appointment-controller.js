import { query, pool } from "../config/db.js";
import logger from "../utils/logger.js";
import { emitSocketEvent } from "../utils/socket.js";
import notifyUser from "../utils/notifyUser.js";

/**
 * Provider cancels an appointment.
 * - Checks appointment existence and ownership.
 * - Updates appointment status and frees the time slot.
 * - Notifies both provider and user via Socket.IO.
 */
export async function providerCancelAppointment(req, res, next) {
  const { appointmentId } = req.params;
  const providerId = req.user.providerId;

  try {
    // 1. Fetch the appointment
    const findAppointmentQuery = `
      SELECT provider_id, timeslot_id, status
      FROM appointments
      WHERE id = $1
    `;
    const appointmentResult = await query(findAppointmentQuery, [appointmentId]);

    if (appointmentResult.rows.length === 0) {
      logger.warn(`Cancel failed: Appointment ${appointmentId} not found`);
      const err = new Error("Appointment not found");
      err.status = 404;
      return next(err);
    }

    const appointment = appointmentResult.rows[0];

    // 2. Verify this appointment really belongs to the provider
    if (appointment.provider_id !== providerId) {
      logger.warn(
        `Unauthorized cancel attempt: Provider ${providerId} tried to cancel appointment ${appointmentId}`
      );
      const err = new Error("You are not allowed to cancel this appointment");
      err.status = 403;
      return next(err);
    }

    if (appointment.status === "canceled") {
      logger.warn(
        `Cancel failed: Appointment ${appointmentId} already canceled`
      );
      const err = new Error("Appointment has already been canceled");
      err.status = 409;
      return next(err);
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

    // 5. Notify both provider and user via Socket.IO
    const io = req.app.get("io");
    if (io) {
      try {
        await Promise.all([
          emitSocketEvent(
            io,
            `provider_${appointment.provider_id}`,
            "appointment_canceled",
            {
              message: "Appointment canceled",
              appointmentId,
              by: "provider",
              timestamp: new Date().toISOString(),
            }
          ),
          emitSocketEvent(
            io,
            `user_${appointment.user_id}`,
            "appointment_canceled",
            {
              message: "Your appointment was canceled by provider",
              appointmentId,
              timestamp: new Date().toISOString(),
            }
          ),
        ]);
      } catch (socketError) {
        logger.error(
          "Socket notification failed but cancellation succeeded:",
          socketError
        );
        // Don't fail the request just because notifications failed
      }
    }
    res.status(200).json({
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

/**
 * Client cancels their own appointment.
 * - Checks appointment existence and ownership.
 * - Updates appointment status and frees the time slot.
 * - Notifies both provider and user via Socket.IO.
 */

export async function cancelAppointment(req, res, next) {
  const clientId = req.user.id;
  const { appointmentId } = req.params;
  console.log(clientId, appointmentId);

  try {
    // 1. Fetch the appointment
    const findAppointmentQuery = `
        SELECT user_id, provider_id, timeslot_id, status
        FROM appointments
        WHERE id = $1
      `;
    const appointmentResult = await query(findAppointmentQuery, [appointmentId]);

    console.log(clientId, appointmentId);

    if (appointmentResult.rows.length === 0) {
      logger.warn(`Cancel failed: Appointment ${appointmentId} not found`);
      const err = new Error("Appointment not found");
      err.status = 404;
      return next(err);
    }

    const appointment = appointmentResult.rows[0];

    // 2. Check if user is authorized
    if (appointment.user_id !== clientId) {
      logger.warn(`Cancel failed: Unauthorized user ${clientId}`);
      const err = new Error("You are not allowed to cancel this appointment");
      err.status = 401;
      return next(err);
    }

    if (appointment.status === "canceled") {
      logger.warn(
        `Cancel failed: Appointment ${appointmentId} already canceled`
      );
      const err = new Error("Appointment has already been canceled");
      err.status = 409;
      return next(err);
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

    logger.info(`Appointment ${appointmentId} canceled by user ${clientId}`);

    // 5. Notify both provider and user via Socket.IO
    const io = req.app.get("io");
    if (io) {
      await Promise.all([
        emitSocketEvent(
          io,
          `provider_${appointment.provider_id}`,
          "appointment_canceled",
          {
            message: "Appointment canceled by client",
            appointmentId,
            timestamp: new Date().toISOString(),
          }
        ),
        emitSocketEvent(io, `user_${clientId}`, "appointment_canceled", {
          message: "You canceled an appointment",
          appointmentId,
          timestamp: new Date().toISOString(),
        }),
      ]);
    }
    res.status(200).json({
      message: "Appointment canceled successfully",
      updatedAppointment: canceledResult.rows[0],
    });
  } catch (error) {
    logger.error(`Error canceling appointment ${appointmentId}:`, error);
    res
      .status(500)
      .json({ message: "Failed to cancel appointment", error: error.message });
  }
}

/**
 * Provider views all their appointments.
 * Returns a list of appointments with client info and timeslot details.
 */
export async function viewProviderAppointments(req, res, next) {
  const providerId = req.user.providerId;

  try {
    const providerAppointmentsQuery = `
      SELECT a.id AS appointment_id, a.status, a.created_at,
             t.day, t.start_time, t.end_time,
             u.first_name AS client_first_name,
             u.last_name AS client_last_name
      FROM appointments a
      JOIN time_slots t ON a.timeslot_id = t.id
      JOIN users u ON a.user_id = u.id
      WHERE a.provider_id = $1
      ORDER BY t.day DESC, t.start_time DESC
    `;

    const appointmentsResult = await query(providerAppointmentsQuery, [
      providerId,
    ]);
    logger.info("Appointments successfully fetched");
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

/**
 * Client views all their appointments.
 * Returns a list of appointments with provider info and timeslot details.
 */
export async function viewMyAppointments(req, res, next) {
  const clientId = req.user.id;

  try {
    const myAppointmentsQuery = `
      SELECT a.id AS appointment_id, a.status, a.created_at,
             t.day, t.start_time, t.end_time,
             u.first_name AS provider_first_name,
             u.last_name AS provider_last_name,
             p.id AS provider_id
      FROM appointments a
      JOIN time_slots t ON a.timeslot_id = t.id
      JOIN providers p ON a.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.user_id = $1
      ORDER BY ASC
    `;

    const appointmentsResult = await query(myAppointmentsQuery, [clientId]);

    res.status(200).json({ appointments: appointmentsResult.rows });
  } catch (error) {
    logger.error(`Error fetching appointments for client ${clientId}:`, error);
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
}

/**
 * Client books an appointment for a specific timeslot.
 * - Locks the timeslot row to prevent double booking.
 * - Creates the appointment and marks the timeslot as booked.
 * - Notifies the provider via Socket.IO.
 */
export async function bookAppointment(req, res, next) {
  const clientId = req.user.id;
  const { timeslotId } = req.body;
  const client = await pool.connect(); // Get a dedicated connection

  try {
    await client.query("BEGIN"); // Start transaction

    // 1. Lock the timeslot row (now in transaction)
    const timeSlotQuery = `SELECT * FROM time_slots WHERE id = $1 FOR UPDATE`;
    const timeSlotResult = await client.query(timeSlotQuery, [timeslotId]);

    if (timeSlotResult.rows.length === 0) {
      await client.query("ROLLBACK");
      const err = new Error("Time slot not found");
      err.status = 404;
      return next(err);
    }

    const slot = timeSlotResult.rows[0];
    if (slot.is_booked === true) {
      await client.query("ROLLBACK");
      const err = new Error("Time slot already booked");
      err.status = 409;
      return next(err);
    }

    // 2. Create appointment (in same transaction)
    const insertAppointmentQuery = `
      INSERT INTO appointments 
        (user_id, provider_id, timeslot_id, appointment_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const appointmentResult = await client.query(insertAppointmentQuery, [
      clientId,
      slot.provider_id,
      timeslotId,
      slot.day,
      "booked",
    ]);

    // 3. Update timeslot status (in same transaction)
    await client.query(`UPDATE time_slots SET is_booked = TRUE WHERE id = $1`, [
      timeslotId,
    ]);

    //side quest to get provider's user id
    const providerUserIdQuery = `SELECT user_id FROM providers
                                 WHERE id = $1`
    const providerUserIdResult = await query(providerUserIdQuery, [slot.provider_id])

    if (providerUserIdResult.rows.length === 0) {
      await client.query("ROLLBACK");
      const err = new Error("Provider not found");
      err.status = 404;
      return next(err);
    }

    const providerUserId = providerUserIdResult.rows[0].user_id

    await client.query("COMMIT"); // All changes succeed or none do

    // 4. Notify (outside transaction)
    const io = req.app.get("io");
    await notifyUser({
      io,
      rolePrefix: "provider",
      userId: providerUserId,
      type: "new_appointment",
      message: "A new appointment was booked.",
      data: { appointmentId: appointmentResult.rows[0].id, clientId: req.user.id },
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: appointmentResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Booking transaction failed:", error);
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  } finally {
    client.release(); // Always release connection
  }
}

/**
 * Client reschedules an appointment to a new timeslot.
 * - Checks appointment and timeslot validity.
 * - Updates appointment and timeslot statuses.
 * - Notifies both provider and user via Socket.IO.
 */
export async function rescheduleAppointment(req, res) {
  const { appointmentId } = req.params;
  const { newTimeslotId } = req.body;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Verify existing appointment
    const appointmentRes = await client.query(
      `SELECT id, user_id, provider_id, timeslot_id, status 
       FROM appointments 
       WHERE id = $1 FOR UPDATE`,
      [appointmentId]
    );

    if (appointmentRes.rows.length === 0) {
      await client.query("ROLLBACK");
      const err = new Error("Appointment not found");
      err.status = 404;
      return next(err);
    }

    const appointment = appointmentRes.rows[0];

    // 2. Authorization check
    if (appointment.user_id !== userId) {
      await client.query("ROLLBACK");
      logger.error("Unauthorized: You can't reschedule this appointment");
      const err = new Error("Not authorized to reschedule this appointment");
      err.status = 403;
      return next(err);
    }

    // 3. Validate current status
    if (appointment.status === "canceled") {
      await client.query("ROLLBACK");
      const err = new Error("Cannot reschedule a canceled appointment");
      err.status = 400;
      return next(err);
    }

    // 4. Verify new timeslot
    const newSlotRes = await client.query(
      `SELECT id, provider_id, day, is_booked 
       FROM time_slots 
       WHERE id = $1 FOR UPDATE`,
      [newTimeslotId]
    );

    if (newSlotRes.rows.length === 0) {
      await client.query("ROLLBACK");
      const err = new Error("New timeslot not found");
      err.status = 404;
      return next(err);
    }

    const newSlot = newSlotRes.rows[0];

    // 5. Validate new timeslot
    if (newSlot.is_booked) {
      await client.query("ROLLBACK");
      const err = new Error("New timeslot is already booked");
      err.status = 409;
      return next(err);
    }

    if (newSlot.provider_id !== appointment.provider_id) {
      await client.query("ROLLBACK");
      const err = new Error("Cannot reschedule to a different provider");
      err.status = 400;
      return next(err);
    }

    // 6. Perform the reschedule
    await client.query(
      `UPDATE appointments 
       SET timeslot_id = $1, appointment_date = $2, updated_at = NOW() 
       WHERE id = $3`,
      [newTimeslotId, newSlot.day, appointmentId]
    );

    // 7. Update timeslot statuses
    await client.query(`UPDATE time_slots SET is_booked = TRUE WHERE id = $1`, [
      newTimeslotId,
    ]);

    await client.query(
      `UPDATE time_slots SET is_booked = FALSE WHERE id = $1`,
      [appointment.timeslot_id]
    );

    await client.query("COMMIT");

    // 8. Notify via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.to(`provider_${appointment.provider_id}`).emit(
        "appointment_rescheduled",
        {
          appointmentId,
          oldTimeslotId: appointment.timeslot_id,
          newTimeslotId,
          updatedAt: new Date().toISOString(),
        }
      );

      io.to(`user_${userId}`).emit("appointment_rescheduled", {
        appointmentId,
        newTime: newSlot.start_time,
        newDate: newSlot.day,
        updatedAt: new Date().toISOString(),
      });
    }

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      newTimeslot: {
        id: newTimeslotId,
        day: newSlot.day,
        startTime: newSlot.start_time,
        endTime: newSlot.end_time,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(`Reschedule failed: ${error.message}`, {
      appointmentId,
      userId,
      error,
    });
    res.status(500).json({
      message: "Failed to reschedule appointment",
      error: error.message,
    });
  } finally {
    client.release();
  }
}