const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/:productId', recommendationController.getProductRecommendation);

module.exports = router;
