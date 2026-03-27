const express = require('express');
const router = express.Router();
const BookingModel = require('../models/BookingModel');

// ============================
// BOOK PAGE
// ============================
router.get('/book', (req, res) => {
    res.render('book');
});

// ============================
// CREATE BOOKING (DB)
// ============================
router.post('/book', (req, res) => {
    const { name, vehicle, service } = req.body;

    const data = {
        name,
        vehicle,
        service,
        lat: 26.9124,
        lng: 75.7873
    };

    BookingModel.createBooking(data, (err, result) => {
        if (err) {
            console.error(err);
            return res.send("DB Error");
        }

        res.redirect(`/track/${result.insertId}`);
    });
});

// ============================
// TRACK PAGE
// ============================
router.get('/track/:id', (req, res) => {
    const id = req.params.id;

    BookingModel.getBookingById(id, (err, booking) => {
        if (err || !booking) {
            return res.send("Booking not found");
        }

        res.render('track', { booking });
    });
});

// ============================
// MECHANIC PANEL
// ============================
router.get('/mechanic', (req, res) => {

    BookingModel.getAllBookings((err, bookings) => {
        if (err) {
            console.error(err);
            return res.send("DB Error");
        }

        res.render('mechanic', { bookings });
    });
});

// ============================
// MECHANIC TRACKING PAGE
// ============================
router.get('/mechanic-tracking', (req, res) => {
    res.render('mechanic-tracking');
});

module.exports = router;