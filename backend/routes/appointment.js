import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  bookAppointment,
  cancelAppointment,
  providerCancelAppointment,
  rescheduleAppointment,
  viewMyAppointments,
  viewProviderAppointments,
} from "../controllers/appointment-controller.js";
import slotIdValidator, { rescheduleAppointmentValidator } from "../validators/booking-validator.js";
import { providerOnly } from "../middlewares/providerOnly.js";
import { clientOnly } from "../middlewares/clientOnly.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment booking, viewing, cancellation, and rescheduling
 */

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Client books an appointment
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ timeslotId ]
 *             properties:
 *               timeslotId:
 *                 type: string
 *                 format: uuid
 *                 example: 618b47c2-ac87-41b0-a88c-1a039fe85a1d
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Appointment booked successfully }
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Time slot already booked.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - client only.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.post(
  "/booking",
  authMiddleware,
  clientOnly,
  slotIdValidator,
  bookAppointment
);

/**
 * @swagger
 * /view:
 *   get:
 *     summary: View all client appointments
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClientAppointment'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */


router.get("/view", authMiddleware, clientOnly, viewMyAppointments);

/**
 * @swagger
 * /provider/view:
 *   get:
 *     summary: View appointments booked with provider
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProviderAppointment'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.get(
  "/provider/view",
  authMiddleware,
  providerOnly,
  viewProviderAppointments
);

/**
 * @swagger
 * /cancel/{appointmentId}:
 *   patch:
 *     summary: Cancel an appointment (client)
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Appointment canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Appointment canceled successfully }
 *                 updatedAppointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       403:
 *         description: Unauthorized to cancel this appointment.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Appointment not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Already canceled.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.patch(
  "/cancel/:appointmentId",
  authMiddleware,
  clientOnly,
  cancelAppointment
);

/**
 * @swagger
 * /provider/cancel/{appointmentId}:
 *   patch:
 *     summary: Cancel appointment as provider
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Appointment canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Appointment canceled successfully }
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       403:
 *         description: Unauthorized to cancel this appointment.
 *       404:
 *         description: Appointment not found.
 *       409:
 *         description: Appointment already canceled.
 *       500:
 *         description: Server error.
 */

router.patch(
  "/provider/cancel/:appointmentId",
  authMiddleware,
  providerOnly,
  providerCancelAppointment
);

/**
 * @swagger
 * /reschedule/{appointmentId}:
 *   patch:
 *     summary: Reschedule an existing appointment
 *     tags: [Appointments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: appointmentId
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
 *             required: [ newTimeslotId ]
 *             properties:
 *               newTimeslotId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Appointment rescheduled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Appointment rescheduled successfully }
 *                 newTimeslot:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     day: { type: string }
 *                     startTime: { type: string }
 *                     endTime: { type: string }
 *       403:
 *         description: Unauthorized.
 *       409:
 *         description: New timeslot already booked.
 *       500:
 *         description: Server error.
 */


router.patch(
  "/reschedule/:appointmentId",
  authMiddleware,
  clientOnly,
  rescheduleAppointmentValidator,
  rescheduleAppointment
);
export default router;
