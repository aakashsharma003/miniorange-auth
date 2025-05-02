require('dotenv').config();
// console.log("client id", process.env.GOOGLE_CLIENT_ID);
// console.log(process.env)
module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/auth-system",
    JWT_SECRET: process.env.JWT_SECRET || "123456789",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "123456789",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:5000",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  }
  