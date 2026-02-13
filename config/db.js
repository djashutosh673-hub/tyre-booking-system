const { Pool } = require('pg');
require('dotenv').config();

// Use Render DATABASE_URL (NOT SUPABASE_DB_URL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test DB connection (optional but VERY helpful)
pool.connect()
    .then(() => console.log('✅ PostgreSQL Connected Successfully'))
    .catch(err => console.error('❌ DB Connection Error:', err));

module.exports = {
    query: (text, params) => pool.query(text, params)
};
