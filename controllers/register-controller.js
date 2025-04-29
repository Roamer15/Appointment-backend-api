import { query } from "../config/db.js"
import logger from "../utils/logger.js"
import bcrypt from "bcryptjs"

const HASH_SALT = 10;

export async function registrationHandler(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  let {profileImageUrl} = req.body | `https://png.pngtree.com/thumb_back/fh260/background/20211107/pngtree-abstract-crystal-background-low-poly-textured-triangle-shapes-in-random-pattern-image_915268.png`

  try {
    // 1. Check if client already exists
    const clientCheckQuery = 'SELECT email FROM clients WHERE email = $1';
    const clientCheckResult = await query(clientCheckQuery, [email]);

    if (clientCheckResult.rows.length > 0) {
      logger.warn(`Registration attempt failed: Email already exists - email: ${email}`);
      return res.status(409).json({ message: "Email already in use" });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, HASH_SALT);
    logger.debug(`Password hashed: ${passwordHash}`);

    // 3. Insert into clients
    const insertClientSql = `
      INSERT INTO clients (first_name, last_name, email, password, profile_image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name
    `;

    const newClientResult = await query(insertClientSql, [firstName, lastName, email, passwordHash, profileImageUrl]);
    const newUser = newClientResult.rows[0];

    logger.info(`User registered successfully: ${newUser.id}`);

    // 4. Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: `${newUser.first_name} ${newUser.last_name}`
      }
    });

  } catch (error) {
    logger.error(`Error during user registration for ${email}: `, error);
    next(error);
  }
}


export async function providerRegistrationHandler(req, res, next) {
  const { firstName, lastName, email, password, specialty, bio } = req.body;

  try {
    // 1. Check if client already exists
    const clientCheckQuery = 'SELECT email FROM providers WHERE email = $1';
    const clientCheckResult = await query(clientCheckQuery, [email]);

    if (clientCheckResult.rows.length > 0) {
      logger.warn(`Registration attempt failed: Email already exists - email: ${email}`);
      return res.status(409).json({ message: "Email already in use" });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, HASH_SALT);
    logger.debug(`Password hashed: ${passwordHash}`);

    const rating = (Math.random() * 9 + 1).toFixed(1);
    // 3. Insert into clients
    const insertClientSql = `
      INSERT INTO providers (first_name, last_name, email, password, specialty, bio, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, first_name, last_name, specialty, bio
    `;

    const newProviderResult = await query(insertClientSql, [firstName, lastName, email, passwordHash, specialty, bio, rating]);
    const newProvider = newProviderResult.rows[0];

    logger.info(`Provider registered successfully: ${newProvider.id}`);

    // 4. Send success response
    res.status(201).json({
      message: "Provider registered successfully",
      user: {
        id: newProvider.id,
        name: `${newProvider.first_name} ${newProvider.last_name}`
      }
    });

  } catch (error) {
    logger.error(`Error during provider registration for ${email}: `, error);
    next(error);
  }
}
