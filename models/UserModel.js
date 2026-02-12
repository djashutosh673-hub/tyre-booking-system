const db = require('../config/db');

const User = {
    async create(name, email, phone, vehicle_number) {
        const query = `
            INSERT INTO users (name, email, phone, vehicle_number)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [name, email, phone, vehicle_number];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    },

    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    async getAll() {
        const result = await db.query('SELECT * FROM users ORDER BY id DESC');
        return result.rows;
    }
};

module.exports = User;