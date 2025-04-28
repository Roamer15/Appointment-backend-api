import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { bookAppointment, cancelAppointment, providerCancelAppointment, viewMyAppointments, viewProviderAppointments } from "../controllers/appointment-controller.js"
import slotIdValidator from "../validators/booking-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"

const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Manipulation of appointments
 */
/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Client books an appointment
 *     tags: [Appointments]
 *     description: Allows an authenticated client to book appointments with providers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeslotId
 *             properties:
 *               timeslotId:
 *                 type: string
 *                 format: uuid
 *                 example: "618b47c2-ac87-41b0-a88c-1a039fe85a1d"
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment booked successfully.
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     provider_id: { type: string, format: uuid }
 *                     client_id: { type: string, format: uuid }
 *                     timeslot_id: { type: string, format: uuid }
 *                     appointment_date: { type: string, format: date }
 *                     status: { type: string }
 *                     created_at: { type: string, format: date-time }
 *                     updated_at: { type: string, format: date-time }
 *       400:
 *         description: Validation error (e.g., missing or invalid fields).
 *       409:
 *         description: appointment has already been made.
 *       401:
 *         description: Unauthorized - only authenticated clients can book appointments.
 *       500:
 *         description: Server error while booking the appointment.
 *     security:
 *       - bearerAuth: []
 */


router.post('/booking', authMiddleware, slotIdValidator, bookAppointment)


/**
 * @swagger
 * /view-bookings:
 *   get:
 *     summary: Client views their the booked appointments
 *     tags: [Appointments]
 *     description: Allows an authenticated client to view all their booked appointments.
 *     responses:
 *       200:
 *         description: List of booked appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       appointment_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       status:
 *                         type: string
 *                         format: option
 *                         example: "booked"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                       day:
 *                         type: string
 *                         example: "2025-04-23"
 *                       start_time:
 *                         type: string
 *                         format: time
 *                       end_time:
 *                         type: string
 *                         format: time
 *                       provider_first_name::
 *                         type: string
 *                         example: "Roger"
 *                       provider_last_name::
 *                         type: string
 *                         example: "Example"
 *       401:
 *         description: Unauthorized - Token has expired.
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
router.get('/view-bookings', authMiddleware, viewMyAppointments)


/**
 * @swagger
 * /provider/view-bookings/{providerId}:
 *   get:
 *     summary: Provider views the appointments for which he/she has been booked
 *     tags: [Appointments]
 *     description: Allows a provider to view all their rendez-vous.
 *     responses:
 *       200:
 *         description: List of booked appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       appointment_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       status:
 *                         type: string
 *                         format: option
 *                         example: "booked"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                       day:
 *                         type: string
 *                         example: "2025-04-23"
 *                       start_time:
 *                         type: string
 *                         format: time
 *                       end_time:
 *                         type: string
 *                         format: time
 *                       provider_first_name::
 *                         type: string
 *                         example: "Roger"
 *                       provider_last_name::
 *                         type: string
 *                         example: "Example"
 *       400:
 *         description: Invalid provider ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * 
 *       401:
 *         description: Unauthorized - Token has expired.
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

router.get('/provider/view-bookings/:id', providerOnly, viewProviderAppointments)

/**
 * @swagger
 * /{appointmentId}/cancel:
 *   patch:
 *     summary: Client gets to cancel the appointments he/she has been booked
 *     tags: [Appointments]
 *     description: Allows a client to cancel their rendez-vous.
 *     responses:
 *       200:
 *         description: Canceled appointment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: {type: string, example: "Appointment canceled successfully"}
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       appointment_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       status:
 *                         type: string
 *                         format: option
 *                         example: "canceled"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                       day:
 *                         type: string
 *                         example: "2025-04-23"
 *                       start_time:
 *                         type: string
 *                         format: time
 *                       end_time:
 *                         type: string
 *                         format: time
 *                       provider_first_name::
 *                         type: string
 *                         example: "Roger"
 *                       provider_last_name::
 *                         type: string
 *                         example: "Example"
 *       400:
 *         description: Invalid provider ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * 
 *       401:
 *         description: Unauthorized - Token has expired.
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

router.patch("/:appointmentId/cancel", authMiddleware, cancelAppointment);

/**
 * @swagger
 * /provider/{providerId}/{appointmentId}/cancel:
 *   patch:
 *     summary: Provider can cancel apointments which he/she has been booked for
 *     tags: [Appointments]
 *     description: Allows a provider to cancel their rendez-vous.
 *     responses:
 *       200:
 *         description: Cancel booked appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       client_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       provider_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       timeslot_id:
 *                         type: string
 *                         format: uuid
 *                         example: "4e50b113-db0e-48ba-b2be-76039fca95a0"
 *                       status:
 *                         type: string
 *                         format: option
 *                         example: "canceled"
 *                       appointment_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-26T11:50:54.374Z"
 *                      
 *       400:
 *         description: Invalid provider ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * 
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


router.patch("/provider/:providerId/:appointmentId/cancel", providerOnly, providerCancelAppointment);

export default router