import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { registrationProviderValidator, registrationValidator } from "../validators/auth-validator.js"
import { registerProviderDetails, registrationHandler, resendVerificationEmailHandler, verifyEmailHandler } from "../controllers/register-controller.js"
import { loginValidator } from "../validators/auth-validator.js"
import {loginHandler} from "../controllers/login-controller.js"
import { logoutUser } from "../controllers/logout-controller.js"
import upload from "../middlewares/upload.js"

const router = express.Router()



/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */


/**
 * @swagger
 * /auth/register:
 * post:
 *   summary: Register a new user
 *   tags: [Authentication]
 *   description: Register a new user (client or provider). If the user is a provider, they must complete the second step at `/auth/register/provider`.
 *   requestBody:
 *     required: true
 *     content:
 *       multipart/form-data:
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - email
 *             - password
 *             - role
 *           properties:
 *             firstName:
 *               type: string
 *               example: Ian
 *             lastName:
 *               type: string
 *               example: Roamer
 *             email:
 *               type: string
 *               format: email
 *               example: ian@example.com
 *             password:
 *               type: string
 *               format: password
 *               example: P@ssword123!
 *             role:
 *               type: string
 *               enum: [client, provider]
 *             profilePic:
 *               type: string
 *               format: binary
 *   responses:
 *     201:
 *       description: User registered successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message: { type: string }
 *               userId: { type: string }
 *               nextStep:
 *                 type: string
 *                 example: /auth/register/provider
 *     400:
 *       description: Validation error or missing fields.
 *     409:
 *       description: Email already in use.
 *     500:
 *       description: Internal server error.
 *   security: []
 */

router.post('/register', registrationValidator, upload.single('profilePic'),registrationHandler)

/**
 * @swagger
 * /auth/register/provider:
 * post:
 *   summary: Complete provider registration
 *   tags: [Authentication]
 *   description: Second step of provider registration (after basic user creation).
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - specialty
 *             - bio
 *           properties:
 *             userId: { type: string }
 *             specialty: { type: string, example: Therapist }
 *             bio: { type: string, example: Experienced mental health therapist }
 *   responses:
 *     201:
 *       description: Provider details saved successfully.
 *     400:
 *       description: Validation error.
 *     404:
 *       description: User not found or not a provider.
 *     500:
 *       description: Server error.
 *   security: []
 *
 */
router.post('/register/provider', registrationProviderValidator, registerProviderDetails)

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
 * /auth/verify-email:
 * get:
 *   summary: Verify user's email
 *   tags: [Authentication]
 *   description: Activates a user's account by verifying their email via a token sent to their inbox.
 *   parameters:
 *     - in: query
 *       name: token
 *       required: true
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Email verified successfully.
 *     400:
 *       description: Invalid or expired token.
 *     500:
 *       description: Internal server error.
 *   security: []
 */

router.get("/verify-email", verifyEmailHandler);

/**
 * /auth/resend-verification:
 * post:
 *   summary: Resend verification email
 *   tags: [Authentication]
 *   description: Sends a new verification email to the user.
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email: { type: string, example: ian@example.com }
 *   responses:
 *     200:
 *       description: Verification email resent successfully.
 *     404:
 *       description: Email not found.
 *     400:
 *       description: User is already verified.
 *     500:
 *       description: Internal server error.
 *   security: []
 */

router.post("/resend-verification", resendVerificationEmailHandler);


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