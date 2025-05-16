import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const HASH_SALT = 10;


export async function registrationHandler(req, res, next) {
  const { firstName, lastName, email, password, role } = req.body;
  let profileImageUrl =
    "https://png.pngtree.com/thumb_back/fh260/background/20211107/pngtree-abstract-crystal-background-low-poly-textured-triangle-shapes-in-random-pattern-image_915268.png";

  try {
    const userCheckQuery = "SELECT email FROM users WHERE email = $1";
    const userCheckResult = await query(userCheckQuery, [email]);

    if (userCheckResult.rows.length > 0) {
      logger.warn(`Registration attempt failed: Email already exists - ${email}`);
      const err = new Error("Email already in use")
      err.status = 409
      return next(err)
    }

    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "appointment-backend-api/profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      try {
        const uploadResult = await streamUpload(req.file.buffer);
        profileImageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        logger.error("Cloudinary upload failed, using default profile picture", uploadErr);
      }
    }

    const passwordHash = await bcrypt.hash(password, HASH_SALT);

    if (!["client", "provider"].includes(role)) {
      const err = new Error('Invalid role. Must be "client" or "provider".')
      err.status = 400
      return next(err)
    }

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

    // If provider, stop here and wait for phase 2
    if (role === "provider") {
      return res.status(201).json({
        message: "Basic user profile created. Continue with provider details.",
        userId: newUser.id,
        nextStep: "/auth/register/provider",
      });
    }

    // Client user: proceed to verification
    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    await query(`UPDATE users SET verification_token = $1 WHERE id = $2`, [
      verificationToken,
      newUser.id,
    ]);

    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(newUser.email, newUser.first_name, verificationUrl);

    logger.info(`Client registered and verification email sent: ${newUser.id}`);

    res.status(201).json({
      message: "User registered successfully, check your email for verification",
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
export async function registerProviderDetails(req, res, next) {
  const { userId, specialty, bio } = req.body;

  try {
    const userResult = await query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (!userResult.rows.length) {
      const err = new Error("User not found")
      err.status = 404
      return next(err)
    }

    const user = userResult.rows[0];
    if (user.role !== "provider") {
      const err = new Error("User is not registered as provider")
      err.status = 400
      return next(err)
    }

    await query(
      `INSERT INTO providers (user_id, specialty, bio) VALUES ($1, $2, $3)`,
      [userId, specialty || null, bio || null]
    );

    // Email verification now
    const verificationToken = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    await query(`UPDATE users SET verification_token = $1 WHERE id = $2`, [
      verificationToken,
      userId,
    ]);

    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(user.email, user.first_name, verificationUrl);

    logger.info(`Provider details completed and email sent for ${userId}`);

    res.status(201).json({
      message: "Provider profile completed. Check your email for verification.",
    });
  } catch (error) {
    logger.error("Error completing provider registration", error);
    next(error);
  }
}

async function sendVerificationEmail(toEmail, firstName, verificationUrl) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"BookNest" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email Address",
    html: `
     <div style="font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif; max-width: 640px; margin: auto; padding: 0; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); border: 1px solid #e8e8e8;">
  <!-- Header with gradient -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Welcome to BookNest!</h1>
    <div style="color: rgba(255,255,255,0.8); font-size: 16px; margin-top: 8px;">Your premium content hub awaits</div>
  </div>
  
  <!-- Main content -->
  <div style="padding: 32px 40px;">
    <h2 style="color: #2d3748; margin-top: 0; font-size: 22px; font-weight: 600;">Hi ${firstName},</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
      Thank you for joining <span style="font-weight: 600; color: #5a67d8;">BookNest</span>! We're thrilled to have you on board. To complete your registration and unlock all features, please verify your email address:
    </p>
    
    <!-- CTA Button with hover effect -->
    <div style="text-align: center; margin: 32px 0 40px;">
      <a href="${verificationUrl}" style="background-color: #5a67d8; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(90, 103, 216, 0.3); transition: all 0.3s ease;">
        Verify My Email Address
      </a>
    </div>
    
    <!-- Expiration notice with icon -->
    <div style="background-color: #f8f9fa; border-left: 4px solid #e9c46a; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; color: #6b7280; font-size: 14px; display: flex; align-items: center;">
        <span style="margin-right: 8px;">⏳</span> For security reasons, this link expires in <strong>2 hours</strong>
      </p>
    </div>
    
    <p style="font-size: 14px; line-height: 1.5; color: #718096; margin-bottom: 0;">
      If you didn't request this account, no further action is required. For any questions, contact our <a href="mailto:support@booknest.com" style="color: #5a67d8; text-decoration: underline;">support team</a>.
    </p>
  </div>
  
  <!-- Footer -->
  <div style="padding: 24px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #edf2f7;">
    <p style="margin: 0 0 12px 0; font-size: 14px; color: #a0aec0;">
      Connect with us:
      <a href="#" style="margin: 0 8px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" alt="Instagram"></a>
      <a href="#" style="margin: 0 8px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="20" alt="Twitter"></a>
      <a href="#" style="margin: 0 8px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="20" alt="LinkedIn"></a>
    </p>
    <p style="margin: 0; font-size: 12px; color: #a0aec0;">
      &copy; ${new Date().getFullYear()} BookNest. All rights reserved.<br>
      <span style="font-size: 11px;">123 Business Ave, Suite 500, San Francisco, CA 94107</span>
    </p>
  </div>
</div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function verifyEmailHandler(req, res, next) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const userResult = await query(
      `SELECT is_verified FROM users WHERE id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      const err = new Error("User not found")
      err.status = 404
      return next(err)
    }

    if (userResult.rows[0].is_verified) {
      const err = new Error("Email already verified, check your spam to be sure")
      err.status = 400
      return next(err)
    }

    await query(
      `UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1`,
      [userId]
    );

    logger.info(`User ${userId} email verified successfully`);

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Email Verified</title>
          <style>
            body {
              background-color: #f0f4f8;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: white;
              padding: 2rem 3rem;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              text-align: center;
            }
            h1 {
              color: #28a745;
            }
            p {
              margin-top: 1rem;
              font-size: 1.1rem;
            }
            a {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.5rem 1rem;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            }
            a:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Email Verified!</h1>
            <p>You can now log in to your account.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    logger.error(`Email verification failed: `, error);
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }
}

export async function resendVerificationEmailHandler(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Fetch user by email
    const userResult = await query(
      `SELECT id, username, is_verified FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // Generate a new verification token
    const verificationToken = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Update the token in the database
    await query(`UPDATE users SET verification_token = $1 WHERE id = $2`, [
      verificationToken,
      user.id,
    ]);

    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    // Send the email again
    await sendVerificationEmail(email, user.username, verificationUrl);

    logger.info(`Resent verification email to user ${user.id}`);

    res
      .status(200)
      .json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    logger.error(`Error resending verification email: `, error);
    next(error);
  }
}
