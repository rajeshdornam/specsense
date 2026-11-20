const db = require('../database/db');
const { z } = require('zod');

const createAlertSchema = z.object({
  productId: z.number().int().positive(),
  targetPrice: z.number().positive(),
  userEmail: z.string().email().optional()
});

async function getAllAlerts(req, res, next) {
  try {
    const alerts = await db.all(`
      SELECT a.*, p.name as product_name, p.brand as product_brand, p.category as product_category,
             p.image_url as product_image_url, p.current_price as product_current_price
      FROM price_alerts a
      JOIN products p ON a.product_id = p.id
      ORDER BY 
        CASE WHEN a.status = 'TRIGGERED' THEN 1 ELSE 2 END,
        a.created_at DESC
    `);

    const triggeredCount = alerts.filter(a => a.status === 'TRIGGERED').length;

    res.json({
      success: true,
      count: alerts.length,
      triggeredCount,
      data: alerts
    });
  } catch (err) {
    next(err);
  }
}

async function createAlert(req, res, next) {
  try {
    const parsed = createAlertSchema.parse({
      productId: Number(req.body.productId),
      targetPrice: Number(req.body.targetPrice),
      userEmail: req.body.userEmail || 'shopper@specsense.io'
    });

    const product = await db.get('SELECT * FROM products WHERE id = ?', [parsed.productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check if current price is already less than or equal to target price
    const isAlreadyTriggered = product.current_price <= parsed.targetPrice;
    const initialStatus = isAlreadyTriggered ? 'TRIGGERED' : 'ACTIVE';
    const nowIso = new Date().toISOString();
    const triggeredAt = isAlreadyTriggered ? nowIso : null;

    const result = await db.run(`
      INSERT INTO price_alerts (product_id, target_price, user_email, status, created_at, triggered_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [parsed.productId, parsed.targetPrice, parsed.userEmail, initialStatus, nowIso, triggeredAt]);

    const newAlert = await db.get(`
      SELECT a.*, p.name as product_name, p.brand as product_brand, p.current_price as product_current_price, p.image_url as product_image_url
      FROM price_alerts a
      JOIN products p ON a.product_id = p.id
      WHERE a.id = ?
    `, [result.lastInsertId]);

    res.status(201).json({
      success: true,
      message: isAlreadyTriggered 
        ? 'Alert created and immediately triggered because target price is at or above current price!'
        : 'Price alert created successfully.',
      data: newAlert
    });
  } catch (err) {
    next(err);
  }
}

async function deleteAlert(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.get('SELECT id FROM price_alerts WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    await db.run('DELETE FROM price_alerts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Price Checking Service / Simulator
 * Evaluates all ACTIVE alerts against current product prices.
 * If current_price <= target_price, triggers the alert.
 * Can also simulate a slight price drop for demonstration.
 */
async function runPriceCheck(req, res, next) {
  try {
    const { simulateDropProductId } = req.body || {};

    // If demo simulation requested for a specific product, apply temporary promotional price
    if (simulateDropProductId) {
      const prod = await db.get('SELECT * FROM products WHERE id = ?', [simulateDropProductId]);
      if (prod) {
        // Drop price by 10% to trigger alerts
        const droppedPrice = Math.round(prod.current_price * 0.90);
        await db.run('UPDATE products SET current_price = ? WHERE id = ?', [droppedPrice, prod.id]);
      }
    }

    const activeAlerts = await db.all(`
      SELECT a.id, a.product_id, a.target_price, p.current_price, p.name
      FROM price_alerts a
      JOIN products p ON a.product_id = p.id
      WHERE a.status = 'ACTIVE'
    `);

    const newlyTriggered = [];
    const nowIso = new Date().toISOString();

    for (const alert of activeAlerts) {
      if (alert.current_price <= alert.target_price) {
        await db.run(`
          UPDATE price_alerts
          SET status = 'TRIGGERED', triggered_at = ?
          WHERE id = ? AND status = 'ACTIVE'
        `, [nowIso, alert.id]);

        newlyTriggered.push({
          alertId: alert.id,
          productName: alert.name,
          currentPrice: alert.current_price,
          targetPrice: alert.target_price
        });
      }
    }

    res.json({
      success: true,
      checkedCount: activeAlerts.length,
      newlyTriggeredCount: newlyTriggered.length,
      newlyTriggered
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllAlerts,
  createAlert,
  deleteAlert,
  runPriceCheck
};
