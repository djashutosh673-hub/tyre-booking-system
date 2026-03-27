const db = require('../config/db');

// CREATE BOOKING
exports.createBooking = (data, callback) => {
    const sql = `
        INSERT INTO bookings (name, vehicle, service, status, mechanic, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        data.name,
        data.vehicle,
        data.service,
        "pending",
        null,
        data.lat,
        data.lng
    ], callback);
};

// GET BOOKING BY ID
exports.getBookingById = (id, callback) => {
    db.query(
        "SELECT * FROM bookings WHERE id = ?",
        [id],
        (err, result) => {
            if (err) return callback(err);
            callback(null, result[0]);
        }
    );
};

// GET ALL BOOKINGS
exports.getAllBookings = (callback) => {
    db.query(
        "SELECT * FROM bookings ORDER BY id DESC",
        callback
    );
};

// ACCEPT BOOKING
exports.acceptBooking = (id, mechanic, callback) => {
    db.query(
        "UPDATE bookings SET status='assigned', mechanic=? WHERE id=?",
        [mechanic, id],
        callback
    );
};