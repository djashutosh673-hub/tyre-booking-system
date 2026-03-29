const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getHome);
router.get('/shop', userController.getShop);
router.get('/cart', userController.getCart);
router.post('/cart/add/:id', userController.addToCart);
router.post('/cart/update', userController.updateCart);
router.post('/cart/remove/:id', userController.removeFromCart);
router.get('/checkout', userController.getCheckout);
router.post('/place-order', userController.placeOrder);

module.exports = router;