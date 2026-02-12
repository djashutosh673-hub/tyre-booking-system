const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');

// Page route
router.get('/mechanic/dashboard', mechanicController.getDashboard);

// API routes
router.get('/api/mechanic/pending-bookings', mechanicController.getPendingBookings);
router.post('/api/mechanic/accept-booking', mechanicController.acceptBooking);
router.get('/api/mechanic/current-job/:mechanicId', mechanicController.getCurrentJob);
router.get('/api/mechanic/booking-location/:bookingId', mechanicController.getBookingLocation);

module.exports = router;