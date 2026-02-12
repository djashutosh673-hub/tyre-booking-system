const db = require('../config/db');

const Tyre = {
    async create(brand, model, size, price, stock_quantity) {
        const query = `
            INSERT INTO tyres (brand, model, size, price, stock_quantity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [brand, model, size, price, stock_quantity];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async getAll() {
        const result = await db.query('SELECT * FROM tyres WHERE stock_quantity > 0 ORDER BY brand, model');
        return result.rows;
    },

    async findById(id) {
        const query = 'SELECT * FROM tyres WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    async updateStock(id, quantity) {
        const query = 'UPDATE tyres SET stock_quantity = $2 WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id, quantity]);
        return result.rows[0];
    }
};

module.exports = Tyre;