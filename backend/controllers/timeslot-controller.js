import logger from "../utils/logger.js";
import { query } from "../config/db.js";
import { DateTime } from "luxon";

/**
 * Formats the created_at and updated_at timestamps of a slot to a readable string in the specified timezone.
 * @param {Object} slot - The slot object from the database.
 * @param {string} zone - The timezone to use for formatting.
 * @returns {Object} The slot object with formatted timestamps.
 */

function formatTimestamps(slot, zone = "Africa/Douala") {
  return {
    ...slot,
    created_at: DateTime.fromISO(slot.created_at.toISOString())
      .setZone(zone)
      .toFormat("yyyy-MM-dd HH:mm:ss"),
    updated_at: DateTime.fromISO(slot.updated_at.toISOString())
      .setZone(zone)
      .toFormat("yyyy-MM-dd HH:mm:ss"),
  };
}

/**
 * Get all available (not booked) time slots for a provider.
 * Supports optional date range filtering via 'from' and 'to' query params.
 */
export async function getAvailableSlots(req, res) {
  console.log(req.params);
  const { providerId } = req.params;
  const { from, to } = req.query;

  try {
    // Case 1: No date filter - return all available slots
    if (!from && !to) {
      const result = await query(
        `SELECT id, day, start_time, end_time 
         FROM time_slots
         WHERE provider_id = $1 AND is_booked = FALSE
         ORDER BY day, start_time`,
        [providerId]
      );

      logger.info(`Fetched ALL available slots for provider ${providerId}`);
      return res.json({ availableSlots: result.rows });
    }

    // Case 2: Date range filter
    // Validate both dates are provided
    if (!from || !to) {
      return res.status(400).json({
        message: "Both 'from' and 'to' dates are required for filtering",
      });
    }

    // Validate date formats
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      const err = new Error("Invalid date format");
      err.status = 400;
      return next(err);
    }

    // Validate logical date range
    if (fromDate > toDate) {
      const err = new Error("'from' date must be before 'to' date");
      err.status = 400;
      return next(err);
    }

    const result = await query(
      `SELECT id, day, start_time, end_time 
       FROM time_slots
       WHERE provider_id = $1 
         AND is_booked = FALSE
         AND day BETWEEN $2 AND $3
       ORDER BY day, start_time`,
      [providerId, from, to]
    );

    logger.info(
      `Fetched slots for provider ${providerId} between ${from} and ${to}`
    );
    res.json({ availableSlots: result.rows });
  } catch (error) {
    logger.error(`Error fetching slots for provider ${providerId}:`, error);
    res.status(500).json({
      message: "Failed to retrieve available slots",
    });
  }
}

/**
 * Update a time slot's day, start time, or end time.
 * Only the provider who owns the slot can update it.
 * If a field is not provided, the existing value is kept.
 */
export async function updateTimeSlot(req, res) {
  const { slotId } = req.params;
  const providerId = req.user.providerId;

  try {
    // First get the existing slot data

    const { day, startTime, endTime } = req.body;
    const getExistingSlotQuery = `
      SELECT id, provider_id, day, start_time, end_time, is_booked
      FROM time_slots
      WHERE id = $1 AND provider_id = $2
    `;
    const existingSlotResult = await query(getExistingSlotQuery, [
      slotId,
      providerId,
    ]);

    if (existingSlotResult.rows.length === 0) {
      logger.warn(
        `Update failed: Either no time slot with id ${slotId} exists or you do not have access to this slot`
      );
      const checkSlotExistenceQuery = "SELECT id FROM time_slots WHERE id = $1";
      const checkResult = await query(checkSlotExistenceQuery, [slotId]);
      if (checkResult.rows.length === 0) {
        const err = new Error("Time slot does not exist");
        err.status = 404;
        return next(err);
      } else {
        const err = new Error(
          "You do not have permission to update this time slot"
        );
        err.status = 403;
        return next(err);
      }
    }

    const existingSlot = existingSlotResult.rows[0];
    const {
      day: existingDay,
      start_time: existingStartTime,
      end_time: existingEndTime,
    } = existingSlot;

    // Use new values if provided, otherwise keep existing ones
    const updatedDay = day || existingDay;
    const updatedStartTime = startTime || existingStartTime;
    const updatedEndTime = endTime || existingEndTime;

    // Update the slot
    const updateSlotQuery = `
      UPDATE time_slots 
      SET day = $1, start_time = $2, end_time = $3, updated_at = NOW()
      WHERE id = $4 AND provider_id = $5
      RETURNING 
        id, 
        provider_id, 
        TO_CHAR(day, 'YYYY-MM-DD') AS day,
        start_time, 
        end_time, 
        is_booked, 
        created_at, 
        updated_at
    `;

    const updateSlotResult = await query(updateSlotQuery, [
      updatedDay,
      updatedStartTime,
      updatedEndTime,
      slotId,
      providerId,
    ]);

    const updatedSlot = formatTimestamps(updateSlotResult.rows[0]);

    logger.info(
      `Slot ${slotId} updated successfully by provider ${providerId}`
    );
    return res.json({
      message: "Time slot updated successfully",
      updatedSlot: updatedSlot,
    });
  } catch (error) {
    logger.error(
      `Error updating time slot ${slotId} for provider ${providerId}: `,
      error
    );
    return res.status(error.status || 500).json({
      message: error.message || "Server error while updating the time slot",
    });
  }
}

/**
 * Delete a time slot.
 * Only the provider who owns the slot can delete it.
 */
export async function deleteTimeSlot(req, res) {
  const { slotId } = req.params;
  const providerId = req.user.providerId;

  try {
    const deleteSlotQuery = `DELETE
                                 FROM time_slots
                                 WHERE id = $1 AND provider_id = $2
                                 RETURNING *
                                `;
    const deleteSlotResult = await query(deleteSlotQuery, [slotId, providerId]);

    if (deleteSlotResult.rows.length === 0) {
      logger.warn("Slot does not exist");
      const err = new Error("Time slot not found or not owned by provider");
      err.status = 401;
      return next(err);
    }

    const deletedSlot = formatTimestamps(deleteSlotResult.rows[0]);

    logger.info(`Time slot with id: ${slotId} has been deleted successfully`);
    return res.json({
      message: `Time slot deleted successfully`,
      slot: deletedSlot,
    });
  } catch (error) {
    logger.error(`Error deleting time slots for user ${providerId} : `, error);
    res
      .status(500)
      .json({ message: "Failed to fetch time slots", error: error.message });
  }
}

/**
 * View all time slots for the logged-in provider.
 * Returns all slots (booked and unbooked) for the provider.
 */
export async function viewTimeSlot(req, res) {
  const providerId = req.user.providerId;

  try {
    const getTimeSlotsQuery = `SELECT id, day, start_time, end_time, is_booked, created_at, updated_at
                               FROM time_slots
                               WHERE provider_id = $1
                               ORDER BY day, start_time
                              `;

    const getTimeSlotsResult = await query(getTimeSlotsQuery, [providerId]);
    if (getTimeSlotsResult.rows.length === 0) {
      logger.warn(`No timeslots available for ${providerId}`);
      const err = new Error("No time slots available yet");
      err.status = 404;
      return next(err);
    }

    const formattedSlots = getTimeSlotsResult.rows.map((slot) =>
      formatTimestamps(slot)
    );
    res.json({ slots: formattedSlots });

    // res.json({ slots: getTimeSlotsResult.rows });
  } catch (error) {
    logger.error(
      `Error displaying time slots for user ${providerId} : `,
      error
    );
    res
      .status(500)
      .json({ message: "Failed to fetch time slots", error: error.message });
  }
}


/**
 * Create a new time slot for the logged-in provider.
 * Prevents duplicate slots for the same day and time.
 */
export async function createTimeSlot(req, res) {
  const { day, startTime, endTime } = req.body;
  const providerId = req.user.providerId;

  try {
    const checkQuery = `
        SELECT id FROM time_slots
        WHERE provider_id = $1 AND day = $2 AND start_time = $3 AND end_time = $4
      `;

    const existing = await query(checkQuery, [
      providerId,
      day,
      startTime,
      endTime,
    ]);

    if (existing.rows.length > 0) {
      logger.warn(`Duplicate time slot attempt by provider ${providerId}`);
      const err = new Error("Time slot already exists");
      err.status = 409;
      return next(err);
    }

    const insertQuery = `
          INSERT INTO time_slots (provider_id, day, start_time, end_time)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;

    const result = await query(insertQuery, [
      providerId,
      day,
      startTime,
      endTime,
    ]);
    const newTimeSlot = formatTimestamps(result.rows[0]);

    logger.info(
      `Time slot created Successfully by the user ${providerId} : ${newTimeSlot.id}`
    );
    res.status(201).json({ message: "Time slot created", slot: newTimeSlot });
  } catch (err) {
    logger.error(`Error creating time slot for user ${providerId} : `, error);
    res
      .status(500)
      .json({ message: "Error creating time slot", error: err.message });
  }
}
