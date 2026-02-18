const checkAuth = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Home page – booking form
router.get('/', checkAuth, userController.getUserPage);


// Create booking API
router.post('/create-booking', userController.createBooking);

// ⭐ Tracking route
router.get('/track/:id', userController.getTrackingPage);

module.exports = router;
