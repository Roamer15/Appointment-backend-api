import express from "express"
// import authMiddleware from "../middlewares/authMiddleware.js"
import { createTimeSlotValidator } from "../validators/create-time-slot-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"
import { createTimeSlot, viewTimeSlot } from "../controllers/timeslot-controller.js"

const router = express.Router()

router.post('/providers/:id/create-timeslots' , providerOnly, createTimeSlotValidator, createTimeSlot)
router.get('/providers/:id/view-timeslots', providerOnly, viewTimeSlot)

export default router