import { query } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export async function loginHandler(req, res, next) {
  const { email, password } = req.body;
  try {
    const findUserQuery =
      "SELECT id, email, first_name, last_name, password, role, is_verified, profile_image_url FROM users WHERE email = $1";
    const userResult = await query(findUserQuery, [email]);

    if (userResult.rows.length === 0) {
      logger.warn(
        `Login Attempt failed: Account with email ${email} doesn't exist`
      );
      return res
        .status(401)
        .json({ message: "Account not found, invalid credentials" });
    }

    const user = userResult.rows[0];

    if (!user.is_verified) {
      logger.warn(`Login blocked: Unverified email - ${email}`);
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const is_passwordMatch = await bcrypt.compare(password, user.password);

    if (!is_passwordMatch) {
      logger.warn(`Login attempt failed: Incorrect password - ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }
    
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    if (user.role === 'provider') {
      const providerResult = await query(
        `SELECT id FROM providers WHERE user_id = $1`,
        [user.id]
      );
    
      if (providerResult.rows.length === 0) {
        return res.status(400).json({ message: "Provider profile not found" });
      }
    
      payload.providerId = providerResult.rows[0].id;
    }

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
          message: "Login Successful!",
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

// export async function providerLoginHandler(req, res,next){
//   const {email, password} = req.body
//   try {
//       const findProviderQuery =     'SELECT id, email, first_name, last_name, password FROM providers WHERE email = $1'
//       const providerResult = await query(findProviderQuery, [email])

//       if (providerResult.rows.length === 0) {
//           logger.warn(`Login Attempt failed: Account with email ${email} doesn't exist`);
//           return res.status(401).json({ message: "Account not found, invalid credentials" });
//         }

//       const provider = providerResult.rows[0]

//       const is_passwordMatch = await bcrypt.compare(password, provider.password)

//       if(!is_passwordMatch) {
//           logger.warn(`Login attempt failed: Incorrect password - ${email}`)
//           return res.status(401).json({ message: "Invalid password" })
//       }

//       const payload = {
//           user: {
//             id: provider.id,
//             email: provider.email
//           }
//         }

//         jwt.sign(payload, process.env.JWT_SECRET,
//           {
//             expiresIn: process.env.JWT_EXPIRES_IN
//           }, (err, token) => {
//             if (err) {
//               logger.error(`Error generating JWT for ${email}: `, err)
//               throw new Error('Error generating authentication token')
//             }
//             logger.info(`Provider logged in successfully: ${email} (ID: ${provider.id})`)
//             res.json({
//               message: "Login Successfull!",
//               token: token,
//               user: {
//                 id: provider.id,
//                 firstName: provider.first_name,
//                 lastName: provider.last_name,
//                 email: provider.email,
//               }
//             })
//           })
//   } catch(err) {
//       logger.error(`Error during login process for ${email}: `, err)
//   res.status(500).json({ message: err.message || "Server error during login" })
//   }
// }
