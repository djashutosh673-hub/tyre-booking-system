const BookingModel = require('../models/BookingModel');
const UserModel = require('../models/UserModel');
const TyreModel = require('../models/TyreModel');
const config = require('../config');


// ============================================
// Render booking page
// ============================================

exports.getUserPage = (req, res) => {

    res.render('user/index', {
        googleMapsApiKey: config.googleMapsApiKey
    });

};


// ============================================
// Create Booking
// ============================================

exports.createBooking = async (req, res) => {

    try {

        const {
            userName,
            userPhone,
            vehicleNumber,
            service,
            lat,
            lng,
            bookingDate,
            bookingTime
        } = req.body;

        const booking = await BookingModel.createBooking({

            userId: 1,
            tyreId: 1,
            bookingDate,
            bookingTime,
            notes: service,
            pickupLat: parseFloat(lat),
            pickupLng: parseFloat(lng)

        });

        res.status(201).json({
            success: true,
            bookingId: booking.id
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Booking failed"
        });

    }

};


// ============================================
// ⭐ Render Tracking Page (VERY IMPORTANT)
// ============================================

exports.getTrackingPage = async (req, res) => {

    const bookingId = req.params.id;

    try {

        res.render('user/track', {
            booking: { id: bookingId }
        });

    } catch (err) {

        console.error("Tracking page error:", err);

        res.status(500).send("Tracking page error");

    }

};
