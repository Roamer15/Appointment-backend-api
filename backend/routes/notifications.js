import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getNotifications, getUnReadNotifications } from '../controllers/notification-controller.js'

const router = express.Router()

router.get('/all', authMiddleware, getNotifications)

router.get('/unread', authMiddleware, getUnReadNotifications)

export default router