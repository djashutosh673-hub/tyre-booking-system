const BookingModel = require('../models/BookingModel');
const db = require('../config/db');
const config = require('../config');

// Render mechanic dashboard page
exports.getDashboard = (req, res) => {
    res.render('mechanical/dashboard', {
        googleMapsApiKey: config.googleMapsApiKey
    });
};

// Get all pending bookings
exports.getPendingBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.getPendingBookings();
        res.json(bookings);
    } catch (err) {
        console.error('❌ Error fetching pending bookings:', err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// Accept a booking (assign to mechanic)
exports.acceptBooking = async (req, res) => {
    try {
        const { bookingId, mechanicId } = req.body;
        if (!bookingId || !mechanicId) {
            return res.status(400).json({ error: 'Booking ID and Mechanic ID required' });
        }

        const updatedBooking = await BookingModel.acceptBooking(bookingId, mechanicId);
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found or already accepted' });
        }

        const io = req.app.locals.io;
        io.to(`booking-${bookingId}`).emit('booking-accepted', {
            bookingId: updatedBooking.id,
            mechanicId: updatedBooking.mechanic_id,
            status: updatedBooking.status
        });

        res.json({ success: true, booking: updatedBooking });
    } catch (err) {
        console.error('❌ Error accepting booking:', err);
        res.status(500).json({ error: 'Failed to accept booking' });
    }
};

// Get current job for a mechanic
exports.getCurrentJob = async (req, res) => {
    try {
        const mechanicId = parseInt(req.params.mechanicId);
        const query = `
            SELECT b.*, u.name as user_name, u.vehicle_number, 
                   t.brand, t.model, t.size
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN tyres t ON b.tyre_id = t.id
            WHERE b.mechanic_id = $1 AND b.status = 'confirmed'
            ORDER BY b.created_at DESC
            LIMIT 1;
        `;
        const result = await db.query(query, [mechanicId]);
        res.json(result.rows[0] || null);
    } catch (err) {
        console.error('❌ Error fetching current job:', err);
        res.status(500).json({ error: 'Failed to fetch current job' });
    }
};

// Get booking location (pickup lat/lng) for a specific booking
exports.getBookingLocation = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const booking = await BookingModel.getBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({
            pickupLat: booking.pickup_lat,
            pickupLng: booking.pickup_lng,
            customerName: booking.user_name,
            vehicleNumber: booking.vehicle_number
        });
    } catch (err) {
        console.error('❌ Error fetching booking location:', err);
        res.status(500).json({ error: 'Failed to fetch booking location' });
    }
};