const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ⭐ Auto connect + create tables
(async () => {

    try {

        const client = await pool.connect();

        console.log("✅ PostgreSQL Connected Successfully");

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

        console.log("✅ Users table ready");

        client.release();

    } catch(err) {

        console.error("❌ DB Connection Error:", err);

    }

})();

module.exports = {
    query: (text, params) => pool.query(text, params)
};
