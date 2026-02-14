const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Auto connect + auto create table
(async () => {
    try {
        const client = await pool.connect();

        console.log('✅ PostgreSQL Connected Successfully');

        // AUTO CREATE USERS TABLE (if not exists)
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                phone VARCHAR(20),
                vehicle_number VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Users table ready');

        client.release();
    } catch (err) {
        console.error('❌ DB Connection Error:', err);
    }
})();

// Export query function
module.exports = {
    query: (text, params) => pool.query(text, params)
};
