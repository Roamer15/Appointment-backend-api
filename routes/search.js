import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getAvailableSlots } from "../controllers/timeslot-controller.js"

const router = express.Router()

router.get('/providers/:id/available-slots', authMiddleware, getAvailableSlots)

export default router