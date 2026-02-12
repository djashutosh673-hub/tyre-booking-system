const db = require('../config/db');

const Mechanic = {
    async create(name, email, phone, specialization) {
        const query = `
            INSERT INTO mechanics (name, email, phone, specialization)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [name, email, phone, specialization];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async findByEmail(email) {
        const query = 'SELECT * FROM mechanics WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    },

    async getAllAvailable() {
        const query = 'SELECT * FROM mechanics WHERE available = true ORDER BY name';
        const result = await db.query(query);
        return result.rows;
    },

    async updateAvailability(id, available) {
        const query = 'UPDATE mechanics SET available = $2 WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id, available]);
        return result.rows[0];
    }
};

module.exports = Mechanic;