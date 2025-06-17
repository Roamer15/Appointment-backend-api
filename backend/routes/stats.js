import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { providerOnly } from "../middlewares/providerOnly.js"
import { ProviderStats } from '../controllers/stats-controller.js'

const router = express.Router()

router.get('/',authMiddleware, providerOnly, ProviderStats)

export default router