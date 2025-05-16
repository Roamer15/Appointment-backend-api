import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createTimeSlotValidator, updateTimeSlotValidator } from "../validators/create-time-slot-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"
import { createTimeSlot, deleteTimeSlot, getAvailableSlots, updateTimeSlot, viewTimeSlot } from "../controllers/timeslot-controller.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Time Slots
 *   description: Endpoints for providers to manage their available time slots
 */

/**
 * @swagger
 * /timeslots/create:
 *   post:
 *     summary: Create a time slot
 *     tags: [Time Slots]
 *     description: Allows a provider to create a new available time slot.
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
 *                 example: "2025-05-28"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "10:00:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "10:30:00"
 *     responses:
 *       201:
 *         description: Time slot created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Time slot created }
 *                 slot:
 *                   $ref: '#/components/schemas/TimeSlot'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Slot conflict
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */

router.post('/create', authMiddleware, providerOnly, createTimeSlotValidator, createTimeSlot)

/**
 * @swagger
 * /timeslots/view:
 *   get:
 *     summary: View provider's time slots
 *     tags: [Time Slots]
 *     description: Returns all time slots created by the authenticated provider.
 *     responses:
 *       200:
 *         description: Time slots retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TimeSlot'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */

router.get('/view', authMiddleware, providerOnly, viewTimeSlot)


/**
 * @swagger
 * /timeslots/delete/{slotId}:
 *   delete:
 *     summary: Delete a time slot
 *     tags: [Time Slots]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Time slot deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Time slot deleted successfully }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */


router.delete('/delete/:slotId', authMiddleware, providerOnly, deleteTimeSlot)


/**
 * @swagger
 * /timeslots/update/{slotId}:
 *   put:
 *     summary: Update a time slot
 *     tags: [Time Slots]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
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
 *                 example: "2025-06-01"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "11:00:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "11:30:00"
 *     responses:
 *       200:
 *         description: Time slot updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeSlot'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */

router.put('/update/:slotId', authMiddleware, providerOnly, updateTimeSlotValidator, updateTimeSlot)


/**
 * @swagger
 * /timeslots/available-slots:
 *   get:
 *     summary: Get available time slots
 *     tags: [Time Slots]
 *     description: Returns a list of all available (unbooked) time slots for the provider.
 *     responses:
 *       200:
 *         description: Available slots retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TimeSlot'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.get('/available-slots', authMiddleware, providerOnly, getAvailableSlots)

export default router