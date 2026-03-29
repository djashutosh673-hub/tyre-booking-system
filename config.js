require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'secret123'
};