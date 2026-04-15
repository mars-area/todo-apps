import dotenv from "dotenv";

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  salt: process.env.SALT || "salt",
  app_name: process.env.APP_NAME || "Todo App",

  whitelist_cors: process.env.WHITELIST_CORS || ["http://localhost:5173"],
  bearer_token: process.env.BEARER_TOKEN || "token",

  // JWT
  jwt_secret: process.env.JWT_SECRET || "secret",
  jwt_access_token_expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || 1000 * 60 * 60 * 1, // 1 hour
  jwt_refresh_token_expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || 1000 * 60 * 60 * 24 * 1 // 1 days
};

export default config;
