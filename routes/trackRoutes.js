const express = require('express');
const router = express.Router();

// Customer tracking page
router.get('/track/:bookingId', (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        // 🔥 get data from memory
        const updated = req.app.locals.bookings?.[bookingId] || {};

        const booking = {
            id: bookingId,
            name: updated.name || "bipana",
            vehicle: updated.vehicle || "ktm",
            service: updated.service || "car",
            booking_date: updated.booking_date || "2026-03-28",
            booking_time: updated.booking_time || "02:02",
            pickup_lat: updated.pickup_lat || 26.9124,
            pickup_lng: updated.pickup_lng || 75.7873,
            status: updated.status || "pending",
            mechanic: updated.mechanic || null
        };

        res.render('track', { booking });

    } catch (err) {
        console.error('❌ Tracking page error:', err);
        res.status(500).send('Server error');
    }
});
router.get('/track/:id', (req, res) => {
    const id = req.params.id;

    BookingModel.getBookingById(id, (err, booking) => {
        if(err || !booking){
            return res.send("Booking not found");
        }

        res.render('track', { booking });
    });
});

module.exports = router;