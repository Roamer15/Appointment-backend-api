import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function providerCancelAppointment(req, res) {
  const { appointmentId } = req.params;
  const providerId = req.user.providerId

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
    logger.info("Socket.IO instance in real app:", req.app.get("io"));
    
    if(io) {
      await io.to(appointment.provider_id).emit("appointment_canceled", {
        message: "An appointment was canceled",
        appointmentId: appointmentId,
      });
      logger.info(`🔔 Notification sent to provider ${appointment.provider_id}`);
  
      await io.to(appointment.user_id).emit("appointment_canceled", {
        message: "Your appointment was canceled",
        appointmentId: appointmentId,
      });
      logger.info(`🔔 Notification sent to provider ${appointment.user_id}`);
  
    }
    

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
        SELECT user_id, provider_id, timeslot_id, status
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
    if (appointment.user_id !== userId) {
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
    logger.info("Socket.IO instance in real app:", req.app.get("io"));

    if(io) {
      await io.to(appointment.provider_id).emit("appointment_canceled", {
        message: "An appointment was canceled",
        appointmentId: appointmentId,
      });
      logger.info(`🔔 Notification sent to provider ${appointment.provider_id}`);
  
      await io.to(appointment.user_id).emit("appointment_canceled", {
        message: "Your appointment was canceled",
        appointmentId: appointmentId,
      });
      logger.info(`🔔 Notification sent to provider ${appointment.user_id}`);
  
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

export async function viewProviderAppointments(req, res) {
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
             u.first_name AS provider_first_name,
             u.last_name AS provider_last_name
      FROM appointments a
      JOIN time_slots t ON a.timeslot_id = t.id
      JOIN providers p ON a.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.user_id = $1
      ORDER BY t.day, t.start_time
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


export async function bookAppointment(req, res) {
  const clientId = req.user.id;
  const { timeslotId } = req.body;

  try {
    // 1. Lock the timeslot row
    const timeSlotQuery = `SELECT * FROM time_slots WHERE id = $1 FOR UPDATE`;
    const timeSlotResult = await query(timeSlotQuery, [timeslotId]);

    if (timeSlotResult.rows.length === 0) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    const slot = timeSlotResult.rows[0];
    if (slot.is_booked === true) {
      return res.status(409).json({ message: "Time slot already booked" });
    }

    // 2. Proceed to book
    const appointmentDate = slot.day;
    const providerId = slot.provider_id;
    const status = "booked";

    const insertAppointmentQuery = `
      INSERT INTO appointments (user_id, provider_id, timeslot_id, appointment_date, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const appointmentResult = await query(insertAppointmentQuery, [
      clientId,
      providerId,
      timeslotId,
      appointmentDate,
      status,
    ]);

    const updateSlotQuery = `UPDATE time_slots SET is_booked = TRUE WHERE id = $1`;
    await query(updateSlotQuery, [timeslotId]);

    const io = req.app.get("io");
    if (io) {
      io.to(providerId).emit("new_appointment", {
        message: "You have a new appointment booked!",
        appointment: appointmentResult.rows[0],
      });
    }

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: appointmentResult.rows[0],
    });

  } catch (error) {
    logger.error("Transaction error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
}


// // PATCH /appointments/:appointmentId/reschedule
// export async function rescheduleAppointment(req, res) {
//   const { appointmentId } = req.params;
//   const { newTimeslotId } = req.body;
//   const clientId = req.user.id;

//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     // 1. Fetch the appointment
//     const appointmentRes = await client.query(
//       `SELECT timeslot_id, provider_id, status, client_id FROM appointments WHERE id = $1 FOR UPDATE`,
//       [appointmentId]
//     );

//     if (appointmentRes.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     const appointment = appointmentRes.rows[0];

//     if (appointment.client_id !== clientId) {
//       await client.query('ROLLBACK');
//       return res.status(403).json({ message: "You are not allowed to reschedule this appointment" });
//     }

//     if (appointment.status === 'canceled') {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ message: "Cannot reschedule a canceled appointment" });
//     }

//     // 2. Check if new time slot is available
//     const slotRes = await client.query(
//       `SELECT * FROM time_slots WHERE id = $1 FOR UPDATE`,
//       [newTimeslotId]
//     );

//     if (slotRes.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ message: "New time slot not found" });
//     }

//     const newSlot = slotRes.rows[0];
//     if (newSlot.is_booked) {
//       await client.query('ROLLBACK');
//       return res.status(409).json({ message: "New time slot already booked" });
//     }

//     // 3. Update appointment to new slot
//     await client.query(
//       `UPDATE appointments SET timeslot_id = $1, appointment_date = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
//       [newTimeslotId, newSlot.day, appointmentId]
//     );

//     // 4. Update time slots
//     await client.query(`UPDATE time_slots SET is_booked = TRUE WHERE id = $1`, [newTimeslotId]);
//     await client.query(`UPDATE time_slots SET is_booked = FALSE WHERE id = $1`, [appointment.timeslot_id]);

//     await client.query('COMMIT');

//     const io = req.app.get("io");
//     if (io) {
//       io.to(appointment.provider_id).emit("appointment_rescheduled", {
//         message: "An appointment has been rescheduled",
//         appointmentId,
//         newTimeslotId,
//       });
//     }

//     return res.status(200).json({ message: "Appointment rescheduled successfully" });

//   } catch (error) {
//     await client.query('ROLLBACK');
//     logger.error("Reschedule error:", error);
//     return res.status(500).json({ message: "Failed to reschedule", error: error.message });
//   } finally {
//     client.release();
//   }
// }
