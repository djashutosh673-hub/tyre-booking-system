const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* ===== WELCOME + HOME ===== */
router.get('/', userController.getWelcome);
router.get('/home', userController.getHome);

/* ===== SHOP ===== */
router.get('/shop', userController.getShop);

/* ===== CART ===== */
router.get('/cart', userController.getCart);
router.post('/cart/add/:id', userController.addToCart);
router.post('/cart/update', userController.updateCart);
router.post('/cart/remove/:id', userController.removeFromCart);

/* ===== CHECKOUT ===== */
router.get('/checkout', userController.getCheckout);
router.post('/place-order', userController.placeOrder);

module.exports = router;