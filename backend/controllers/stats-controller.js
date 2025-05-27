import { pool } from "../config/db.js";
import logger from "../utils/logger.js";

export async function ProviderStats(req, res, next) {
 const providerId = req.user.providerId;

  try {
    const client = await pool.connect();
    
    const today = new Date().toISOString().split('T')[0];
    logger.info(today)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

    // 1. First validate all query strings
    const queries = [
      `SELECT COUNT(*) 
       FROM appointments a
       JOIN time_slots ts ON a.timeslot_id = ts.id
       WHERE a.provider_id = $1 AND ts.day = $2 AND status = 'booked'`,
      
      `SELECT COUNT(*) 
       FROM appointments a
       JOIN time_slots ts ON a.timeslot_id = ts.id
       WHERE a.provider_id = $1 AND ts.day = $2`,
      
      `SELECT 
         COUNT(*) FILTER (WHERE a.status = 'booked') as booked,
         COUNT(*) FILTER (WHERE a.status = 'canceled') as canceled
       FROM appointments a
       JOIN time_slots ts ON a.timeslot_id = ts.id
       WHERE a.provider_id = $1 AND ts.day BETWEEN $2 AND $3`,
      
      // Fixed query - moved the division inside AVG()
      `SELECT AVG(EXTRACT(EPOCH FROM (ts.end_time - ts.start_time))/60) as avg_duration
 FROM appointments a
 JOIN time_slots ts ON a.timeslot_id = ts.id
 WHERE a.provider_id = $1 AND a.status = 'booked' AND ts.day BETWEEN $2 AND $3`,
      
      `SELECT a.status, COUNT(*) as count
       FROM appointments a
       JOIN time_slots ts ON a.timeslot_id = ts.id
       WHERE a.provider_id = $1 AND ts.day BETWEEN $2 AND $3
       GROUP BY a.status`
    ];

    // 2. Verify no query is null/undefined
    if (queries.some(q => !q)) {
      throw new Error('One or more queries are undefined');
    }

    // 3. Execute queries
    const [
      todayCountRes,
      yesterdayCountRes,
      weeklyStatsRes,
      avgDurationRes,
      statusDistributionRes
    ] = await Promise.all([
      client.query(queries[0], [providerId, today]),
      client.query(queries[1], [providerId, getPreviousDay(today)]),
      client.query(queries[2], [providerId, oneWeekAgoStr, today]),
      client.query(queries[3], [providerId, oneWeekAgoStr, today]),
      client.query(queries[4], [providerId, oneWeekAgoStr, today])
    ]);

    // Calculate changes
    const todayCount = parseInt(todayCountRes.rows[0].count);
    const yesterdayCount = parseInt(yesterdayCountRes.rows[0].count);
    const todayChange =
      yesterdayCount > 0
        ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
        : 0;

    // Calculate completion rate
    const weeklyStats = weeklyStatsRes.rows[0];
    const totalWeekly = (weeklyStats.booked || 0) + (weeklyStats.canceled || 0);
    const completionRate =
      totalWeekly > 0
        ? Math.round(((weeklyStats.booked || 0) / totalWeekly) * 100)
        : 0;

    // Format response
    const stats = {
      todayCount,
      todayChange,
      avgDuration: Math.round(avgDurationRes.rows[0]?.avg_duration) || 0,
      completionRate,
      bookedThisWeek: parseInt(weeklyStats.booked) || 0,
      canceledThisWeek: parseInt(weeklyStats.canceled) || 0,
      statusDistribution: statusDistributionRes.rows.map((row) => ({
        status: row.status,
        count: parseInt(row.count),
      })),
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    res.status(500).json({
      error: "Failed to fetch provider statistics",
      details: error.message,
    });
  }
}

// Helper function to get previous day
function getPreviousDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}
