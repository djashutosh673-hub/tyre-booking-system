const supabase = require('../config/supabase');
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
// Create Booking (FIXED)
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

        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    name: userName,
                    phone: userPhone,
                    vehicle: vehicleNumber,
                    service: service,
                    booking_date: bookingDate,
                    booking_time: bookingTime,
                    pickup_lat: parseFloat(lat),
                    pickup_lng: parseFloat(lng)
                }
            ])
            .select();

        if (error) {
            console.log("❌ Supabase Error:", error);
            return res.status(500).json({ error: "Booking failed" });
        }

        res.status(201).json({
            success: true,
            bookingId: data[0].id
        });

    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ error: "Booking failed" });
    }
};

// ============================================
// Tracking Page
// ============================================

exports.getTrackingPage = async (req, res) => {
    const bookingId = req.params.id;

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error) {
            console.log(error);
        }

        res.render('user/track', {
            booking: data || { id: bookingId }
        });

    } catch (err) {
        console.error("Tracking page error:", err);
        res.status(500).send("Tracking page error");
    }
};