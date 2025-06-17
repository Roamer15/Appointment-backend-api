import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getMyProfile, getProviderPublicProfile, updateMyProfile } from "../controllers/account-controller.js"
import { userUpdateValidator } from "../validators/user-validator.js"
import upload from "../middlewares/upload.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: View and update user or provider profiles
 */

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Account]
 *     security: [ { bearerAuth: [] } ]
 *     description: Retrieves the profile of the currently logged-in user (client or provider).
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.get('/', authMiddleware, getMyProfile)

/**
 * @swagger
 * /account/update:
 *   patch:
 *     summary: Update your account profile
 *     tags: [Accounts]
 *     description: Allows a user to update their profile details including name, email, password, and optionally a profile picture.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewP@ss123!
 *               profilePic:
 *                 type: string
 *                 format: binary
 *               specialty:
 *                 type: string
 *                 example: Electrician
 *               bio:
 *                 type: string
 *                 example: I fix all electrical issues safely.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Profile updated successfully }
 *                 user:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/ClientProfile'
 *                     - $ref: '#/components/schemas/ProviderProfile'
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized - token missing or expired.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */


router.patch('/update', authMiddleware, userUpdateValidator, upload.single('profilePic'), updateMyProfile)

/**
 * @swagger
 * /account/providers/{providerId}:
 *   get:
 *     summary: Get public profile of a provider
 *     tags: [Accounts]
 *     description: Retrieve the public-facing profile of a provider (name, bio, specialty, rating, etc.)
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         description: The unique ID of the provider
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Public provider profile retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicProviderProfile'
 *       404:
 *         description: Provider not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.get('/providers/:providerId', getProviderPublicProfile);

export default router