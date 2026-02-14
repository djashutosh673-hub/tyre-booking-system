const { Pool } = require('pg');
require('dotenv').config();

// ============================================
// PostgreSQL Connection (Supabase)
// ============================================

const pool = new Pool({

    // ⭐ Use SUPABASE connection string
    connectionString: process.env.SUPABASE_DB_URL,

    ssl: {
        rejectUnauthorized: false
    }

});


// ============================================
// Auto Connect + Auto Table Creation
// ============================================

(async () => {

    try {

        const client = await pool.connect();

        console.log('✅ PostgreSQL Connected Successfully');

        // AUTO CREATE USERS TABLE
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


// ============================================
// Export Query Helper
// ============================================

module.exports = {
    query: (text, params) => pool.query(text, params)
};
