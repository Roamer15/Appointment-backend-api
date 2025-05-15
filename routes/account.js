import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getMyProfile } from "../controllers/account-controller.js"

const router = express.Router()

router.get('/', authMiddleware, getMyProfile)

export default router