const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);
router.get('/dashboard', adminController.dashboard);
router.get('/tyres/add', adminController.showAddTyre);
router.post('/tyres', adminController.addTyre);
router.get('/tyres/edit/:id', adminController.showEditTyre);
router.post('/tyres/edit/:id', adminController.editTyre);
router.post('/tyres/delete/:id', adminController.deleteTyre);
router.get('/bookings', adminController.viewBookings);

module.exports = router;