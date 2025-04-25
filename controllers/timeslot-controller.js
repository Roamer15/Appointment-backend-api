import logger from "../utils/logger.js";
import { query } from "../config/db.js";

export async function deleteTimeSlot(req, res) {
    
}
export async function viewTimeSlot(req, res){
    const providerId = req.params.id

    try {

    const getTimeSlotsQuery = `SELECT day, start_time, end_time, is_booked, created_at, updated_at
                               FROM time_slots
                               WHERE provider_id = $1
                               ORDER BY day, start_time
                              `
    const getTimeSlotsResult = await query(getTimeSlotsQuery, [providerId])
    if(getTimeSlotsResult.rows === 0) {
        logger.warn(`No timeslots available for ${providerId}`)
        return
    }

    res.json({ slots: getTimeSlotsResult.rows });
    } catch(error) {
        logger.error(`Error displaying time slots for user ${providerId} : `, error)
        res.status(500).json({ message: "Failed to fetch time slots", error: error.message });
    }
}

export async function createTimeSlot(req, res) {
    const {day, startTime, endTime} = req.body
    const providerId = req.params.id;

    try {

        const checkQuery = `
        SELECT id FROM time_slots
        WHERE provider_id = $1 AND day = $2 AND start_time = $3 AND end_time = $4
      `;
  
      const existing = await query(checkQuery, [providerId, day, startTime, endTime]);
  
      if (existing.rows.length > 0) {
        logger.warn(`Duplicate time slot attempt by provider ${providerId}`);
        return res.status(409).json({ message: "Time slot already exists" });
      }

        const insertQuery = `
          INSERT INTO time_slots (provider_id, day, start_time, end_time)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
    
        const result = await query(insertQuery, [providerId, day, startTime, endTime]);
        const newTimeSLot = result.rows[0]

        logger.info(`Time slot created Successfully by the user ${providerId} : ${newTimeSLot.id}`)
        res.status(201).json({ message: "Time slot created", slot: result.rows[0] });

      } catch (err) {
        logger.error(`Error creating time slot for user ${providerId} : `, error)
        res.status(500).json({ message: "Error creating time slot", error: err.message });
      }

}