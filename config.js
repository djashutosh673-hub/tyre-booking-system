require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};