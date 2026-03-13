import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,

  CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
  

  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_secret:process.env.CLOUDINARY_API_secret,
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
  INNGEST_SIGNING_KEY:process.env.INNGEST_SIGNING_KEY



};