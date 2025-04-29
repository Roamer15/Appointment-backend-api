import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "production" // Use https
});

// Check configuration (optional but recommended)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.error('FATAL ERROR: Cloudinary environment variables are missing! Check your .env file.');
  process.exit(1);
} else {
  logger.info('Cloudinary configured successfully.');
}


export { cloudinary }
