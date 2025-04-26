import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { bookAppointment } from "../controllers/appointment-controller.js"
import slotIdValidator from "../validators/booking-validator.js"

const router = express.Router()

router.get('/booking', authMiddleware, slotIdValidator, bookAppointment)

export default router