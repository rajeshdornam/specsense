const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/:productId/history', priceController.getPriceHistory);
router.get('/:productId/summary', priceController.getPriceSummary);
router.get('/:productId', priceController.getProductPrices);

module.exports = router;
