const express = require('express');
const router = express.Router();
const { getAllProducts, addProductToCart, getCartItems, removeProductFromCart } = require('../controllers/buyerController');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

// Get all products
router.get('/products', authUserMiddleware, getAllProducts);

// Add product to cart
router.post('/cart', authUserMiddleware, addProductToCart);

// Get all products in cart
router.get('/cart', authUserMiddleware, getCartItems);

// Remove product from cart
router.delete('/cart/', authUserMiddleware, removeProductFromCart);

module.exports = router;
