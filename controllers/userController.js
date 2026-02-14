const BookingModel = require('../models/BookingModel');
const UserModel = require('../models/UserModel');
const TyreModel = require('../models/TyreModel');
const config = require('../config');


// ============================================
// Render user booking page
// ============================================

exports.getUserPage = (req, res) => {

    res.render('user/index', {
        googleMapsApiKey: config.googleMapsApiKey
    });

};


// ============================================
// Create booking
// ============================================

exports.createBooking = async (req, res) => {

    try {

        let {
            userName,
            userPhone,
            vehicleNumber,
            service,
            lat,
            lng,
            bookingDate,
            bookingTime
        } = req.body;

        // Validate
        if (!userName || !userPhone || !service || !lat || !lng || !bookingDate || !bookingTime) {

            return res.status(400).json({
                error: 'All fields are required'
            });

        }

        // Convert date format if needed
        if (bookingDate.includes('/')) {

            const [day, month, year] = bookingDate.split('/');
            bookingDate = `${year}-${month}-${day}`;

        }

        // Find or create user
        const tempEmail = userPhone + '@temp.com';

        let user = await UserModel.findByEmail(tempEmail);

        if (!user) {

            try {

                user = await UserModel.create(
                    userName,
                    tempEmail,
                    userPhone,
                    vehicleNumber || 'Unknown'
                );

            } catch (err) {

                user = await UserModel.findByEmail(tempEmail);

                if (!user) {
                    throw new Error('Could not create or find user');
                }

            }

        }

        // Find tyre
        const tyres = await TyreModel.getAll();

        let tyreId = 1;

        if (tyres.length > 0) {

            const matchedTyre = tyres.find(t =>
                t.model.toLowerCase().includes(service.toLowerCase()) ||
                t.brand.toLowerCase().includes(service.toLowerCase())
            );

            tyreId = matchedTyre ? matchedTyre.id : tyres[0].id;

        }

        // Create booking
        const notes = `Customer: ${userName}, ${userPhone}`;

        const booking = await BookingModel.createBooking({

            userId: user.id,
            tyreId,
            bookingDate,
            bookingTime,
            notes,
            pickupLat: parseFloat(lat),
            pickupLng: parseFloat(lng)

        });

        // Emit socket event
        const io = req.app.locals.io;

        io.to('mechanics').emit('new-booking', {

            id: booking.id,
            userName: user.name,
            userPhone: user.phone,
            service,
            pickupLat: booking.pickup_lat,
            pickupLng: booking.pickup_lng

        });

        // Success response
        res.status(201).json({

            success: true,
            bookingId: booking.id

        });

    } catch (err) {

        console.error('❌ Booking creation error:', err);

        res.status(500).json({
            error: 'Failed to create booking',
            details: err.message
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

        console.error("❌ Tracking page error:", err);
        res.status(500).send("Tracking page error");

    }

};
