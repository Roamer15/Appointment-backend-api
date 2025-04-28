import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { registrationValidator } from "../validators/auth-validator.js"
import { registrationHandler } from "../controllers/register-controller.js"
import { loginValidator } from "../validators/auth-validator.js"
import {loginHandler} from "../controllers/login-controller.js"
import { logoutUser } from "../controllers/logout-controller.js"

const router = express.Router()



/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */


/**
 *
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName: { type: string, example: Ian }
 *               lastName: { type: string, example: Roamer }
 *               email: { type: string, format: email, example: ian@example.com }
 *               password: { type: string, format: password, example: P@word123 }
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User registered successfuly! }
 *                 userId:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *       400:
 *         description: Validation error (e.g., passwords don't match, invalid email).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */



router.post('/register', registrationValidator, registrationHandler)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     description: Logs in a registered user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ian@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@word123
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Login Successful! }
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     firstName: { type: string }
 *                     lastName: { type: string }
 *                     email: { type: string, format: email }
 *       400:
 *         description: Validation error (missing email or password).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during login.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Public endpoint (no auth needed to login)
 */

router.post('/login', loginValidator, loginHandler)


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     description: Logs out the currently authenticated user.
 *     security:
 *       - bearerAuth: [] # Requires authentication
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Logout successful. Please discard your token. }
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post(
    '/logout',
    authMiddleware,
    logoutUser
  );

export default router