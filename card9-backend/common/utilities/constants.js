// Environment variables are injected by Hostinger, no need for dotenv

// Ensure the password is properly trimmed and handled
const DB_NAME = process.env.DB_NAME || "";
const DB_HOST = process.env.DB_HOST || "";
const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD.trim() : "";
const DB_DIALECT = process.env.DB_DIALECT || "";

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "";

const facebookBaseUrl = process.env.FACEBOOK_BASE_URL || "";
const linkedinBaseUrl = process.env.LINKEDIN_BASE_URL || "";

const MAIL_HOST = process.env.MAIL_HOST || "";
const MAIL_PORT = parseInt(process.env.MAIL_PORT) || "";
const MAIL_USER = process.env.MAIL_USER || "";
const MAIL_PASS = process.env.MAIL_PASS || "";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || "";
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || "";

const API_URL = process.env.PRODUCTION_API_URL || "";

module.exports = {
  API_URL,
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
  RECIPIENT_EMAIL,
  facebookBaseUrl,
  linkedinBaseUrl,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
};