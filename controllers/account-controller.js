import { query, pool } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const HASH_SALT = 10;
// Get combined user profile (works for both clients and providers)
export async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    // Single query to get all profile data
    const result = await query(
      `SELECT 
        u.id, u.first_name, u.last_name, u.email, u.role, 
        u.profile_image_url, u.is_verified,
        p.specialty, p.bio, p.rating
       FROM users u
       LEFT JOIN providers p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      logger.error(`User with id ${userId} doesn't exist`);
      return res.status(404).json({ message: "User not found" });
    }

    const profile = result.rows[0];

    logger.info("Profile info loaded successfully");
    const response = {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      role: profile.role,
      profileImageUrl: profile.profile_image_url,
      isVerified: profile.is_verified,
      ...(profile.role === "provider" && {
        providerDetails: {
          specialty: profile.specialty,
          bio: profile.bio,
          rating: profile.rating,
        },
      }),
    };

    res.json(response);
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

export async function updateMyProfile(req, res) {
  const userId = req.user.id;
  const updates = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Handle password update
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, HASH_SALT);
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
        logger.info("Image has been uploaded successfully");

        updates.profileImageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        logger.error(
          "Cloudinary upload failed, using default profile picture",
          uploadErr
        );
      }
    }

    // Convert field names to database format
    const dbFieldMap = {
      firstName: "first_name",
      lastName: "last_name",
      profileImageUrl: "profile_image_url",
    };

    // Build dynamic update query
    const setClause = Object.keys(updates)
      .filter((key) => key in dbFieldMap || ["email", "password"].includes(key))
      .map((key, i) => {
        const dbKey = dbFieldMap[key] || key;
        return `${dbKey} = $${i + 1}`;
      })
      .join(", ");

    const values = Object.entries(updates)
      .filter(
        ([key]) => key in dbFieldMap || ["email", "password"].includes(key)
      )
      .map(([, value]) => value);

    if (values.length > 0) {
      await client.query(
        `UPDATE users SET ${setClause}, updated_at = NOW() 
           WHERE id = $${values.length + 1}`,
        [...values, userId]
      );
    }

    // Handle provider-specific updates
    if (req.user.role === "provider" && (updates.specialty || updates.bio)) {
      const providerUpdates = {};
      if (updates.specialty) providerUpdates.specialty = updates.specialty;
      if (updates.bio) providerUpdates.bio = updates.bio;

      const providerSetClause = Object.keys(providerUpdates)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");

      await client.query(
        `UPDATE providers SET ${providerSetClause}, updated_at = CURRENT_TIMESTAMP 
           WHERE user_id = $${Object.keys(providerUpdates).length + 1}`,
        [...Object.values(providerUpdates), userId]
      );
    }

    await client.query("COMMIT");
    const updatedUser = await client.query(
      `SELECT id, first_name, last_name, email, profile_image_url FROM users WHERE id = $1`,
      [userId]
    );

    let providerDetails = null;
    if (req.user.role === "provider") {
      const providerResult = await client.query(
        `SELECT specialty, bio, rating 
         FROM providers WHERE user_id = $1`,
        [userId]
      );
      providerDetails = providerResult.rows[0];
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser.rows[0],
        ...(providerDetails && { providerDetails }),
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  } finally {
    client.release();
  }
}

// Get public provider profile
export async function getProviderPublicProfile(req, res) {
  try {
    const { providerId } = req.params;

    const result = await query(
      `SELECT 
          u.first_name, u.last_name, u.profile_image_url,
          p.specialty, p.bio, p.rating
         FROM providers p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1 AND u.role = 'provider'`,
      [providerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const provider = result.rows[0];
    res.json({
      firstName: provider.first_name,
      lastName: provider.last_name,
      profileImageUrl: provider.profile_image_url,
      specialty: provider.specialty,
      bio: provider.bio,
      rating: provider.rating,
    });
  } catch (error) {
    logger.error("Public provider fetch error:", error);
    res.status(500).json({ message: "Failed to fetch provider profile" });
  }
}
