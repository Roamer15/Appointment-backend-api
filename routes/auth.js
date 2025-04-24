import express from "express"
// import authMiddleware from "../middlewares/authMiddleware.js"
import { registrationValidator } from "../validators/auth-validator.js"
import { registrationHandler } from "../controllers/register-controller.js"

const router = express.Router()


router.post('/register', registrationValidator, registrationHandler)
// router.post('/login', loginValidator, loginHandler)
// router.post(
//     '/logout',
//     authMiddleware,
//     logoutUser
//   );

export default router