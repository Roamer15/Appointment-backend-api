import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const HASH_SALT = 10;

export async function registrationHandler(req, res, next) {
  const { firstName, lastName, email, password, role, specialty, bio } = req.body;
  let profileImageUrl = 
    "https://png.pngtree.com/thumb_back/fh260/background/20211107/pngtree-abstract-crystal-background-low-poly-textured-triangle-shapes-in-random-pattern-image_915268.png";

  try {
    // 1. Check if user already exists
    const userCheckQuery = 'SELECT email FROM users WHERE email = $1';
    const userCheckResult = await query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      logger.warn(`Registration attempt failed: Email already exists - ${email}`);
      return res.status(409).json({ message: "Email already in use" });
    }

    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "appointment-backend-api/profiles" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      try {
        const uploadResult = await streamUpload(req.file.buffer);
        profileImageUrl = uploadResult.secure_url; // ✅ Overwrite fallback if uploaded
      } catch (uploadErr) {
        logger.error(
          "Cloudinary upload failed, using default profile picture",
          uploadErr
        );
      }
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, HASH_SALT);

    // 3. Insert into users table
    const insertUserSql = `
      INSERT INTO users (first_name, last_name, email, password, role, profile_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email, role
    `;
    const userResult = await query(insertUserSql, [
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      profileImageUrl,
    ]);

    const newUser = userResult.rows[0];
    logger.info(`User registered: ${newUser.id} as ${newUser.role}`);

    // 4. If provider, insert into providers table
    if (role === "provider") {
      await query(
        `
        INSERT INTO providers (user_id, specialty, bio)
        VALUES ($1, $2, $3)
      `,
        [newUser.id, specialty || null, bio || null]
      );
      logger.info(`Provider profile created for user ${newUser.id}`);
    }

    // 5. Return response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    logger.error(`Registration error for ${email}:`, error);
    next(error);
  }
}






































// import { query } from "../config/db.js"
// import logger from "../utils/logger.js"
// import bcrypt from "bcryptjs"

// const HASH_SALT = 10;

// export async function registrationHandler(req, res, next) {
//   const { firstName, lastName, email, password, role } = req.body;
//   let {profileImageUrl} = req.body || `https://png.pngtree.com/thumb_back/fh260/background/20211107/pngtree-abstract-crystal-background-low-poly-textured-triangle-shapes-in-random-pattern-image_915268.png`

//   try {
//     // 1. Check if user already exists
//     const userCheckQuery = 'SELECT email FROM users WHERE email = $1';
//     const userCheckResult = await query(userCheckQuery, [email]);

//     if (userCheckResult.rows.length > 0) {
//       logger.warn(`Registration attempt failed: Email already exists - email: ${email}`);
//       return res.status(409).json({ message: "Email already in use" });
//     }

//     // 2. Hash password
//     const passwordHash = await bcrypt.hash(password, HASH_SALT);
//     logger.debug(`Password hashed: ${passwordHash}`);

//     // 3. Insert into clients
//     const insertClientSql = `
//       INSERT INTO clients (first_name, last_name, email, password, profile_image_url, role)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING id, first_name, last_name, role
//     `;

//     const newClientResult = await query(insertClientSql, [firstName, lastName, email, passwordHash, profileImageUrl, role]);
//     const newUser = newClientResult.rows[0];

//     logger.info(`User registered successfully: ${newUser.id}`);

//     // 4. Send success response
//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser.id,
//         name: `${newUser.first_name} ${newUser.last_name}`
//       }
//     });

//   } catch (error) {
//     logger.error(`Error during user registration for ${email}: `, error);
//     next(error);
//   }
// }
