import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getAvailableSlots } from "../controllers/timeslot-controller.js"
import { clientOnly } from "../middlewares/clientOnly.js"
import { searchProviders } from "../controllers/search-controller.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Search Providers
 *   description: Viewing available time slots and searching providers
 */

/**
 * @swagger
 * /providers/{id}/available-slots:
 *   get:
 *     summary: View available slots for a provider
 *     tags: [Time Slots]
 *     description: Allows an authenticated client to view all available (not booked) time slots for a specific provider.
 *     security:
 *       - bearerAuth: []
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
 *         description: Start date to filter slots (optional)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-25"
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: End date to filter slots (optional)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-30"
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully.
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
 *                       day: { type: string, format: date, example: "2025-05-01" }
 *                       start_time: { type: string, format: time, example: "09:00:00" }
 *                       end_time: { type: string, format: time, example: "09:30:00" }
 *       400:
 *         description: Invalid provider ID or bad query parameters.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - authentication required.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: No available slots found for provider.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while fetching available slots.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */


router.get('/providers/:id/available-slots', authMiddleware, getAvailableSlots)

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Search for providers by name or specialty
 *     tags: [Time Slots]
 *     description: Allows authenticated clients to search for providers based on name or specialty.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name of the provider to search (first or last name)
 *         schema:
 *           type: string
 *           example: Sarah
 *       - in: query
 *         name: specialty
 *         required: false
 *         description: Specialty of the provider to search
 *         schema:
 *           type: string
 *           example: Mechanic
 *     responses:
 *       200:
 *         description: Matching providers found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PublicProviderProfile'
 *       400:
 *         description: Bad query parameters.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - client access only.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while searching providers.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */


router.get('/providers', authMiddleware, clientOnly, searchProviders)
export default router