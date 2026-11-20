const db = require('../database/db');
const { calculateHistoricalMetrics } = require('../algorithms/priceAnalytics');

async function getProductPrices(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await db.get('SELECT id, name, brand, current_price, image_url FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Get current price at each retailer (the latest recorded date)
    const retailerPrices = await db.all(`
      SELECT r.id as retailer_id, r.name as retailer_name, r.website, r.badge_color, ph.price, ph.recorded_at
      FROM retailers r
      JOIN price_history ph ON ph.retailer_id = r.id AND ph.product_id = ?
      WHERE ph.recorded_at = (SELECT MAX(recorded_at) FROM price_history WHERE product_id = ?)
      ORDER BY ph.price ASC
    `, [productId, productId]);

    res.json({
      success: true,
      data: {
        product,
        retailers: retailerPrices
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getPriceHistory(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const days = parseInt(req.query.days, 10) || 90;

    const product = await db.get('SELECT id, name, brand, current_price, image_url FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Fetch records for the last N days
    const records = await db.all(`
      SELECT ph.recorded_at, ph.price, r.id as retailer_id, r.name as retailer_name, r.badge_color
      FROM price_history ph
      JOIN retailers r ON ph.retailer_id = r.id
      WHERE ph.product_id = ?
      ORDER BY ph.recorded_at ASC
    `, [productId]);

    // Group by date for multi-series line chart (Amazon, Flipkart, Direct Brand Store)
    const dateMap = new Map();

    records.forEach(row => {
      if (!dateMap.has(row.recorded_at)) {
        dateMap.set(row.recorded_at, {
          date: row.recorded_at,
          Amazon: null,
          Flipkart: null,
          'Direct Brand Store': null,
          average: 0
        });
      }
      const entry = dateMap.get(row.recorded_at);
      entry[row.retailer_name] = row.price;
    });

    const timeline = Array.from(dateMap.values()).slice(-days);

    // Compute daily blended average across available retailers
    timeline.forEach(point => {
      const vals = [point.Amazon, point.Flipkart, point['Direct Brand Store']].filter(v => v !== null && v !== undefined);
      point.blendedAverage = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    });

    res.json({
      success: true,
      data: {
        product,
        days,
        timeline
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getPriceSummary(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const records = await db.all('SELECT price, recorded_at FROM price_history WHERE product_id = ? ORDER BY recorded_at ASC', [productId]);
    const metrics = calculateHistoricalMetrics(records, product.current_price);

    // Retailer breakdown
    const retailers = await db.all(`
      SELECT r.name, r.badge_color, r.website, ph.price as latest_price
      FROM retailers r
      JOIN price_history ph ON ph.retailer_id = r.id AND ph.product_id = ?
      WHERE ph.recorded_at = (SELECT MAX(recorded_at) FROM price_history WHERE product_id = ?)
      ORDER BY ph.price ASC
    `, [productId, productId]);

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image_url: product.image_url,
          current_price: product.current_price
        },
        metrics,
        retailers
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProductPrices,
  getPriceHistory,
  getPriceSummary
};
