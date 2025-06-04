import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getNotifications, getUnReadNotifications, markAllNotificationsAsRead, updateReadNotifications } from '../controllers/notification-controller.js'

const router = express.Router()

router.get('/all', authMiddleware, getNotifications)

router.get('/unread', authMiddleware, getUnReadNotifications)

router.patch('/:id/read', authMiddleware, updateReadNotifications)

router.patch('/mark-all-read', authMiddleware, markAllNotificationsAsRead)
export default router