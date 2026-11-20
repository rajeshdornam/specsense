const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAllAlerts);
router.post('/', alertController.createAlert);
router.delete('/:id', alertController.deleteAlert);
router.post('/simulate-check', alertController.runPriceCheck);

module.exports = router;
