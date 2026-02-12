const express = require('express');
const router = express.Router();
const BookingModel = require('../models/BookingModel');

// Customer tracking page
router.get('/track/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await BookingModel.getBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        res.render('user/track', { 
            booking: booking,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '' 
        });
    } catch (err) {
        console.error('❌ Tracking page error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;