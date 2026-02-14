const db = require('../config/db');

const Booking = {
    async createBooking(bookingData) {
        const { userId, tyreId, bookingDate, bookingTime, notes, pickupLat, pickupLng } = bookingData;
        const query = `
            INSERT INTO bookings (user_id, tyre_id, booking_date, booking_time, notes, status, pickup_lat, pickup_lng)
            VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
            RETURNING *;
        `;
        const values = [userId, tyreId, bookingDate, bookingTime, notes, pickupLat, pickupLng];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async getPendingBookings() {
        const query = `
            SELECT b.*, u.name as user_name, u.vehicle_number, t.brand, t.model, t.size
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN tyres t ON b.tyre_id = t.id
            WHERE b.status = 'pending'
            ORDER BY b.booking_date ASC, b.booking_time ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    },

    async getBookingById(id) {
        const query = `
            SELECT b.*, u.name as user_name, u.vehicle_number, u.phone as user_phone,
                   t.brand, t.model, t.size, m.name as mechanic_name
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN tyres t ON b.tyre_id = t.id
            LEFT JOIN mechanics m ON b.mechanic_id = m.id
            WHERE b.id = $1;
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    async acceptBooking(id, mechanicId) {
        const query = `
            UPDATE bookings
            SET status = 'confirmed', mechanic_id = $2
            WHERE id = $1 AND status = 'pending'
            RETURNING *;
        `;
        const result = await db.query(query, [id, mechanicId]);
        return result.rows[0] || null;
    },

async findById(id) {

    const query = `
        SELECT b.*, u.name as user_name, u.vehicle_number
        FROM bookings b
        LEFT JOIN users u ON u.id = b.user_id
        WHERE b.id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];

}
,


    async updateBookingStatus(id, status) {
        const query = `
            UPDATE bookings
            SET status = $2
            WHERE id = $1
            RETURNING *;
        `;
        const result = await db.query(query, [id, status]);
        return result.rows[0] || null;
    }
};

module.exports = Booking;