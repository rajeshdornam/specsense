const db = require('../database/db');
const { evaluateRecommendation } = require('../algorithms/recommendation');
const { calculateValueForMoney } = require('../algorithms/valueScore');

async function getProductRecommendation(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const priceRecords = await db.all('SELECT price, recorded_at FROM price_history WHERE product_id = ? ORDER BY recorded_at ASC', [productId]);
    const recommendation = evaluateRecommendation(priceRecords, product.current_price);

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image_url: product.image_url
        },
        ...recommendation
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getProductValueScore(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const vfm = calculateValueForMoney(product);

    res.json({
      success: true,
      data: vfm
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProductRecommendation,
  getProductValueScore
};
