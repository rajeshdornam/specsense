const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/sales-events
router.get('/sales-events', async (req, res, next) => {
  try {
    const events = await db.all('SELECT * FROM sales_events ORDER BY id ASC');
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
});

// GET /api/refurbished-deals
router.get('/refurbished-deals', async (req, res, next) => {
  try {
    const deals = await db.all(`
      SELECT id, name, brand, category, image_url, current_price as new_price, 
             refurbished_price, (current_price - refurbished_price) as savings_amount,
             ROUND(((current_price - refurbished_price) * 100.0 / current_price), 1) as savings_pct
      FROM products
      WHERE refurbished_price IS NOT NULL
      ORDER BY savings_pct DESC
    `);
    res.json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
