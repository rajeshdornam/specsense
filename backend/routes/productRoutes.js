const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search route must be before :id to prevent 'search' being treated as id
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);

module.exports = router;
