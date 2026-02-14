const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Home page – booking form
router.get('/', userController.getUserPage);

// Create booking API
router.post('/create-booking', userController.createBooking);

module.exports = router;
