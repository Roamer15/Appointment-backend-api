import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getAvailableSlots } from "../controllers/timeslot-controller.js"
import { clientOnly } from "../middlewares/clientOnly.js"
import { searchProviders } from "../controllers/search-controller.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Time Slots
 *   description: Managing time slots for service providers
 */

/**
 * @swagger
 * /providers/{id}/available-slots:
 *   get:
 *     summary: Client views available slots for a provider
 *     tags: [Time Slots]
 *     description: Allows an authenticated client to view all available (not booked) time slots for a specific provider.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Provider's unique ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: Start date to filter available slots (optional)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-25"
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: End date to filter available slots (optional)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-30"
 *     responses:
 *       200:
 *         description: List of available time slots for the provider.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       slot_id: { type: string, format: uuid }
 *                       day: { type: string, format: date }
 *                       start_time: { type: string, format: time }
 *                       end_time: { type: string, format: time }
 *       400:
 *         description: Invalid provider ID or bad query parameters.
 *       401:
 *         description: Unauthorized - client must be authenticated.
 *       404:
 *         description: No available slots found.
 *       500:
 *         description: Server error while fetching available slots.
 *     security:
 *       - bearerAuth: []
 */


router.get('/providers/:id/available-slots', authMiddleware, getAvailableSlots)

router.get('/providers', authMiddleware, clientOnly, searchProviders)
export default router