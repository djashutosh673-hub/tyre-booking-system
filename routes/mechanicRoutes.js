const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const { isMechanic } = require('../middleware/auth');

router.get('/login', mechanicController.showLogin);
router.post('/login', mechanicController.login);
router.get('/dashboard', isMechanic, mechanicController.dashboard);
router.post('/assign/:id', isMechanic, mechanicController.assignBooking);
router.post('/complete/:id', isMechanic, mechanicController.completeBooking);
router.post('/assign-delivery/:id', isMechanic, mechanicController.assignDelivery);
router.post('/complete-delivery/:id', isMechanic, mechanicController.completeDelivery);
router.post('/update-status', isMechanic, mechanicController.updateBookingStatus);
router.get('/logout', mechanicController.logout);

module.exports = router;