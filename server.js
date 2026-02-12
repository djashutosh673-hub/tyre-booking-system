// ============================================
// ENVIRONMENT & DATABASE
// ============================================
require('dotenv').config();
const db = require('./config/db');

console.log('🚀 Starting server.js');

// ============================================
// ERROR HANDLING
// ============================================
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
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

// ============================================
// ROUTES
// ============================================
const userRoutes = require('./routes/userRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');

// ============================================
// APP INIT
// ============================================
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Make io accessible to controllers
app.locals.io = io;

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
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// ROUTES
// ============================================
app.use('/', userRoutes);
app.use('/', mechanicRoutes);

// ============================================
// SOCKET.IO
// ============================================
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('join-mechanics', () => {
        socket.join('mechanics');
        console.log(`👨‍🔧 Mechanic joined room: mechanics`);
    });

    socket.on('join-booking', (bookingId) => {
        socket.join(bookingId);
        console.log(`📱 User joined room: ${bookingId}`);
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
// SERVER LISTEN
// ============================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});