import { query } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

/**
 * Handles user login.
 * - Checks if the user exists and is verified.
 * - Validates the password.
 * - For providers, fetches the provider profile ID.
 * - Generates a JWT token with user info.
 * - Returns user details and token on success.
 * 
 * @param {Object} req - Express request object (expects email and password in body)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function loginHandler(req, res, next) {
  const { email, password } = req.body;
  try {
    // Find user by email
    const findUserQuery =
      "SELECT id, email, first_name, last_name, password, role, is_verified, profile_image_url FROM users WHERE email = $1";
    const userResult = await query(findUserQuery, [email]);

    // If user not found, return error
    if (userResult.rows.length === 0) {
      logger.warn(
        `Login Attempt failed: Account with email ${email} doesn't exist`
      );
      const err = new Error("Account not found, invalid credentials")
      err.status = 401
      return next(err)
    }

    const user = userResult.rows[0];

    // Block login if email is not verified
    if (!user.is_verified) {
      logger.warn(`Login blocked: Unverified email - ${email}`);
      const err = new Error("Please verify your email before logging in.")
      err.status = 403
      return next(err)
    }

    // Compare password with hashed password in DB
    const is_passwordMatch = await bcrypt.compare(password, user.password);

    if (!is_passwordMatch) {
      logger.warn(`Login attempt failed: Incorrect password - ${email}`);
      const err = new Error("Invalid password")
      err.status = 401
      return next(err)
    }
    
    // Prepare JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    // If user is a provider, fetch provider profile ID and add to payload
    if (user.role === 'provider') {
      const providerResult = await query(
        `SELECT id FROM providers WHERE user_id = $1`,
        [user.id]
      );
    
      if (providerResult.rows.length === 0) {
        const err = new Error("Provider profile not found")
        err.status = 400
        return next(err)
      }
    
      payload.providerId = providerResult.rows[0].id;
    }

    // Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err) {
          logger.error(`Error generating JWT for ${email}: `, err);
          throw new Error("Error generating authentication token");
        }
        logger.info(`User logged in successfully: ${email} (ID: ${user.id}) `);
        res.status(200).json({
          message: "Login Successfull!",
          token: token,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profile_image_url,
            providerId: payload.providerId || null
          },
        });
      }
    );
  } catch (err) {
    logger.error(`Error during login process for ${email}: `, err);
    res
      .status(500)
      .json({ message: err.message || "Server error during login" });
  }
}