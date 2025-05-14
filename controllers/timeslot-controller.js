import logger from "../utils/logger.js";
import { query } from "../config/db.js";
import { DateTime } from "luxon";

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

export async function getAvailableSlots(req, res, next) {
  const providerId = req.params.id;
  const { from, to } = req.query;

  try {
    const result = await query(
      `
        SELECT day, start_time, end_time FROM time_slots
        WHERE provider_id = $1
          AND is_booked = FALSE
          AND day BETWEEN $2 AND $3
        ORDER BY day, start_time
      `,
      [providerId, from, to]
    );

    logger.info(`Slots found for interval`);
    res.json({ availableSlots: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Could not retrieve available slots",
        error: error.message,
      });
  }
}

export async function updateTimeSlot(req, res) {
  const { providerId, slotId } = req.params;
  try {
    const { day, startTime, endTime } = req.body;
    const updateSlotQuery = `UPDATE time_slots SET
                                 day = $1, start_time = $2, end_time = $3
                                 WHERE id = $4 AND provider_id = $5
                                 RETURNING id, 
  provider_id, 
  TO_CHAR(day, 'YYYY-MM-DD') AS day, -- Format as YYYY-MM-DD
  start_time, 
  end_time, 
  is_booked, 
  created_at, 
  updated_at 
                                `;
    const updateSlotResult = await query(updateSlotQuery, [
      day,
      startTime,
      endTime,
      slotId,
      providerId,
    ]);

    if (updateSlotResult.rows.length === 0) {
      logger.warn(
        `Update failed: Either no time slot with id ${slotId} exists or you do not have access to this slot`
      );
      const checkTaskExistenceQuery = "SELECT id FROM time_slots WHERE id = $1";
      const checkResult = await query(checkTaskExistenceQuery, [slotId]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Task does not exist" });
      } else {
        return res
          .status(403)
          .json({ message: "You do not have permission to delete this task" });
      }
    }
    const updatedSlot = formatTimestamps(updateSlotResult.rows[0]);

    logger.info(
      `Slot ${slotId} updated Successfully by provider ${providerId}`
    );
    // return res.json(updateSlotResult.rows[0])
    return res.json({
      message: "Time slot updated successfully",
      updatedSlot: updatedSlot,
    });
  } catch (error) {
    logger.error(
      `Error Updating time slot ${slotId} for provider ${providerId} : `,
      error
    );
    return res.status(error.status || 500).json({
      message: error.message || "Server error while update the time slot",
    });
  }
}

export async function deleteTimeSlot(req, res) {
  const { providerId, slotId } = req.params;

  try {
    const deleteSlotQuery = `DELETE
                                 FROM time_slots
                                 WHERE id = $1 AND provider_id = $2
                                 RETURNING *
                                `;
    const deleteSlotResult = await query(deleteSlotQuery, [slotId, providerId]);

    if (deleteSlotResult.rows.length === 0) {
      logger.warn("Time slot not found or not owned by provider");
      res.status(401).json({ message: "Slot does not exist" });
    }

    const deletedSlot = formatTimestamps(deleteSlotResult.rows[0]);

    logger.info(`Time slot with id: ${slotId} has been deleted successfully`);
    //    return res.status(201).json({
    //                                   message: `Slot deleted`,
    //                                   slot: deleteSlotResult.rows[0]
    //                                 })
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
export async function viewTimeSlot(req, res) {
  const providerId = req.params.id;

  try {
    const getTimeSlotsQuery = `SELECT day, start_time, end_time, is_booked, created_at, updated_at
                               FROM time_slots
                               WHERE provider_id = $1
                               ORDER BY day, start_time
                              `;

    const getTimeSlotsResult = await query(getTimeSlotsQuery, [providerId]);
    if (getTimeSlotsResult.rows.length === 0) {
      logger.warn(`No timeslots available for ${providerId}`);
      return res.status(404).json({ message: "No time slots found" });
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

export async function createTimeSlot(req, res) {
  const { day, startTime, endTime } = req.body;
  const providerId = req.params.id;

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
      return res.status(409).json({ message: "Time slot already exists" });
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
