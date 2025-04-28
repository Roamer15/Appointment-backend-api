import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createTimeSlotValidator } from "../validators/create-time-slot-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"
import { createTimeSlot, deleteTimeSlot, getAvailableSlots, updateTimeSlot, viewTimeSlot } from "../controllers/timeslot-controller.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Time Slots
 *   description: Managing time slots for service providers
 */

/**
 * @swagger
 * /providers/{id}/create-timeslots:
 *   post:
 *     summary: Provider creates a new available time slot
 *     tags: [Time Slots]
 *     description: Allows an authenticated provider to create a new available time slot for bookings.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Provider's unique ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - startTime
 *               - endTime
 *             properties:
 *               day:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-28"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "12:00:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "12:30:00"
 *     responses:
 *       201:
 *         description: Time slot created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Time slot created
 *                 slot:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     provider_id: { type: string, format: uuid }
 *                     day: { type: string, format: date }
 *                     start_time: { type: string, format: time }
 *                     end_time: { type: string, format: time }
 *                     is_booked: { type: boolean }
 *                     created_at: { type: string, format: date-time }
 *                     updated_at: { type: string, format: date-time }
 *       400:
 *         description: Validation error (e.g., missing or invalid fields).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Time slot already exists for the given date and time.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - only providers can create time slots.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while creating the time slot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security:
 *       - bearerAuth: []
 */


router.post('/providers/:id/create-timeslots' , providerOnly, createTimeSlotValidator, createTimeSlot)

/**
 * @swagger
 * /providers/{id}/view-timeslots:
 *   get:
 *     summary: Provider views their available time slots
 *     tags: [Time Slots]
 *     description: Allows an authenticated provider to view all their created time slots.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Provider's unique ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of time slots retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-28"
 *                       start_time:
 *                         type: string
 *                         format: time
 *                         example: "12:00:00"
 *                       end_time:
 *                         type: string
 *                         format: time
 *                         example: "12:30:00"
 *                       is_booked:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid provider ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - only providers can view their time slots.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while fetching time slots.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security:
 *       - bearerAuth: []
 */


router.get('/providers/:id/view-timeslots', providerOnly, viewTimeSlot)

/**
 * @swagger
 * /providers/{providerId}/delete-timeslot/{slotId}:
 *   delete:
 *     summary: Provider deletes a specific time slot
 *     tags: [Time Slots]
 *     description: Allows an authenticated provider to delete one of their created time slots.
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         description: Provider's unique ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: slotId
 *         required: true
 *         description: Time slot's unique ID to be deleted
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Time slot deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Slot deleted
 *                 slot:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     provider_id: { type: string, format: uuid }
 *                     day: { type: string, format: date }
 *                     start_time: { type: string, format: time }
 *                     end_time: { type: string, format: time }
 *                     is_booked: { type: boolean }
 *                     created_at: { type: string, format: date-time }
 *                     updated_at: { type: string, format: date-time }
 *       400:
 *         description: Invalid slot or provider ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized access - provider mismatch.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Time slot not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while deleting the time slot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security:
 *       - bearerAuth: []
 */


router.delete('/providers/:providerId/delete-timeslot/:slotId', providerOnly, deleteTimeSlot)

/**
 * @swagger
 * /providers/{providerId}/update-timeslot/{slotId}:
 *   put:
 *     summary: Provider updates a specific time slot
 *     tags: [Time Slots]
 *     description: Allows an authenticated provider to update an existing time slot (change day, start time, or end time).
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         description: Provider's unique ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: slotId
 *         required: true
 *         description: Time slot's unique ID to be updated
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - startTime
 *               - endTime
 *             properties:
 *               day:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-28"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "14:00:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "14:30:00"
 *     responses:
 *       200:
 *         description: Time slot updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 provider_id: { type: string, format: uuid }
 *                 day: { type: string, format: date }
 *                 start_time: { type: string, format: time }
 *                 end_time: { type: string, format: time }
 *                 is_booked: { type: boolean }
 *                 created_at: { type: string, format: date-time }
 *                 updated_at: { type: string, format: date-time }
 *       400:
 *         description: Validation error or missing fields.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - only providers can update time slots.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: You do not have permission to update this slot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Time slot not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error while updating time slot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security:
 *       - bearerAuth: []
 */


router.put('/providers/:providerId/update-timeslot/:slotId', providerOnly, updateTimeSlot)

router.get('/search/providers/:id/available-slots', authMiddleware, getAvailableSlots)

export default router