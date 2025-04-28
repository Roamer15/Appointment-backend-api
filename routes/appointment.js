import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { bookAppointment, cancelAppointment, providerCancelAppointment, viewMyAppointments, viewProviderAppointments } from "../controllers/appointment-controller.js"
import slotIdValidator from "../validators/booking-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"

const router = express.Router()

router.post('/booking', authMiddleware, slotIdValidator, bookAppointment)
router.get('/view-bookings', authMiddleware, viewMyAppointments)
router.get('/provider/view-bookings/:id', providerOnly, viewProviderAppointments)
router.patch("/:appointmentId/cancel", authMiddleware, cancelAppointment);
router.patch("/provider/:providerId/:appointmentId/cancel", providerOnly, providerCancelAppointment);

export default router