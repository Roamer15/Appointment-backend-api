import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getMyProfile, getProviderPublicProfile, updateMyProfile } from "../controllers/account-controller.js"
import { userUpdateValidator } from "../validators/user-validator.js"
import upload from "../middlewares/upload.js"

const router = express.Router()

router.get('/', authMiddleware, getMyProfile)
router.patch('/update', authMiddleware, userUpdateValidator, upload.single('profilePic'), updateMyProfile)
router.get('/providers/:providerId', getProviderPublicProfile);

export default router