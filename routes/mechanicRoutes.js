const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const { isMechanic } = require('../middleware/auth');

router.get('/login', mechanicController.showLogin);
router.post('/login', mechanicController.login);
router.get('/dashboard', isMechanic, mechanicController.dashboard);
router.post('/update-status', isMechanic, mechanicController.updateBookingStatus);
router.get('/logout', mechanicController.logout);
router.post('/assign/:id', isMechanic, mechanicController.assignBooking);
router.post('/complete/:id', isMechanic, mechanicController.completeBooking);

module.exports = router;