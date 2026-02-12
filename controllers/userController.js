const BookingModel = require('../models/BookingModel');
const UserModel = require('../models/UserModel');
const TyreModel = require('../models/TyreModel');
const config = require('../config'); // ✅ ONLY ONE declaration – this line is enough

// Render user booking page
exports.getUserPage = (req, res) => {
    res.render('user/index', {
        googleMapsApiKey: config.googleMapsApiKey
    });
};

// Create a new booking (AJAX)
exports.createBooking = async (req, res) => {
    try {
        let { userName, userPhone, vehicleNumber, service, lat, lng, bookingDate, bookingTime } = req.body;

        // 1. Validate
        if (!userName || !userPhone || !service || !lat || !lng || !bookingDate || !bookingTime) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // 2. Convert date
        if (bookingDate.includes('/')) {
            const [day, month, year] = bookingDate.split('/');
            bookingDate = `${year}-${month}-${day}`;
        }

        // 3. Find or create user
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
                if (!user) throw new Error('Could not create or find user');
            }
        }

        // 4. Find tyre
        let tyres = await TyreModel.getAll();
        let tyreId = 1;
        if (tyres.length > 0) {
            const matchedTyre = tyres.find(t => 
                t.model.toLowerCase().includes(service.toLowerCase()) || 
                t.brand.toLowerCase().includes(service.toLowerCase())
            );
            tyreId = matchedTyre ? matchedTyre.id : tyres[0].id;
        }

        // 5. Create booking with location
        const notes = `Customer: ${userName}, ${userPhone}`;
        const booking = await BookingModel.createBooking({
            userId: user.id,
            tyreId: tyreId,
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            notes: notes,
            pickupLat: parseFloat(lat),
            pickupLng: parseFloat(lng)
        });

        // 6. Emit socket event
        const io = req.app.locals.io;
        io.to('mechanics').emit('new-booking', {
            id: booking.id,
            userName: user.name,
            userPhone: user.phone,
            service: service,
            pickupLat: booking.pickup_lat,
            pickupLng: booking.pickup_lng,
            bookingDate: booking.booking_date,
            bookingTime: booking.booking_time,
            createdAt: booking.created_at
        });

        // 7. Success response
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