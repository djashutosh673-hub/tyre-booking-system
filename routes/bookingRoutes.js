const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/book', bookingController.showBook);
router.post('/book', bookingController.createBooking);
router.get('/confirmation/:id', bookingController.showConfirmation);  // <-- NEW
router.get('/track', bookingController.trackForm);
router.post('/track', bookingController.track);

module.exports = router;