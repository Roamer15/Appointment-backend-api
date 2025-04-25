import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createTimeSlotValidator } from "../validators/create-time-slot-validator.js"
import { providerOnly } from "../middlewares/providerOnly.js"
import { createTimeSlot, deleteTimeSlot, getAvailableSlots, updateTimeSlot, viewTimeSlot } from "../controllers/timeslot-controller.js"

const router = express.Router()

router.post('/providers/:id/create-timeslots' , providerOnly, createTimeSlotValidator, createTimeSlot)
router.get('/providers/:id/view-timeslots', providerOnly, viewTimeSlot)
router.delete('/providers/:providerId/delete-timeslot/:slotId', providerOnly, deleteTimeSlot)
router.put('/providers/:providerId/update-timeslot/:slotId', providerOnly, updateTimeSlot)
router.get('/search/providers/:id/available-slots', authMiddleware, getAvailableSlots)

export default router