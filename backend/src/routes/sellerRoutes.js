const express = require('express');
const { getProduct, addProduct, editProduct, deleteProduct } = require('../controllers/sellerController');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();
router.get('/product', authUserMiddleware, getProduct);
router.post('/product', authUserMiddleware, addProduct);
router.put('/product/:id', authUserMiddleware, editProduct);
router.delete('/product/:id', authUserMiddleware, deleteProduct);

module.exports = router;

