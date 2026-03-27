// ============================================
// ENVIRONMENT
// ============================================
require('dotenv').config();

console.log('🚀 Starting server.js');

// ============================================
// ERROR HANDLING
// ============================================
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
});

// ============================================
// DEPENDENCIES
// ============================================
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// ============================================
// ROUTES & MODELS
// ============================================
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const BookingModel = require('./models/BookingModel');

// ============================================
// APP INIT
// ============================================
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ============================================
// VIEW ENGINE
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// MIDDLEWARE
// ============================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SESSION
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// ============================================
// API: GET BOOKING (DB)
// ============================================
app.get('/api/bookings/:id', (req, res) => {
    const id = req.params.id;

    BookingModel.getBookingById(id, (err, booking) => {
        if (err || !booking) {
            return res.json({ error: "Booking not found" });
        }

        res.json(booking);
    });
});

// ============================================
// API: ACCEPT BOOKING (DB)
// ============================================
app.get('/api/accept-booking/:id', (req, res) => {
    const id = req.params.id;

    BookingModel.acceptBooking(id, "Rahul Mechanic", (err) => {
        if (err) {
            console.error(err);
            return res.send("DB Error");
        }

        console.log(`✅ Booking ${id} accepted`);

        // 🔥 Real-time update
        io.to(id).emit('booking-updated', {
            status: "assigned",
            mechanic: "Rahul Mechanic"
        });

        res.json({ message: "Booking accepted successfully" });
    });
});

// ============================================
// ROUTES
// ============================================
app.use('/', authRoutes);
app.use('/', userRoutes);

// ============================================
// SOCKET.IO
// ============================================
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('join-booking', (bookingId) => {
        socket.join(bookingId);
        console.log(`📱 User joined booking room: ${bookingId}`);
    });

    socket.on('mechanic-location', (data) => {
        const { bookingId, lat, lng } = data;
        io.to(bookingId).emit('mechanic-location-update', { lat, lng });
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// ============================================
// DEFAULT ROUTE
// ============================================
app.get('/', (req, res) => {
    res.send('✅ Server running. Go to /book');
});

// ============================================
// SERVER START
// ============================================
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});