const db = require('../database/db');
const { calculateValueForMoney } = require('../algorithms/valueScore');

async function getAllProducts(req, res, next) {
  try {
    const { category, search, limit } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    if (search) {
      query += (params.length > 0 ? ' AND' : ' WHERE') + ' (name LIKE ? OR brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY rating DESC, name ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const products = await db.all(query, params);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const vfm = calculateValueForMoney(product);

    res.json({
      success: true,
      data: {
        ...product,
        valueForMoney: vfm
      }
    });
  } catch (err) {
    next(err);
  }
}

async function searchProducts(req, res, next) {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      return res.json({ success: true, data: [] });
    }

    const products = await db.all(
      'SELECT id, name, brand, category, current_price, image_url, rating FROM products WHERE name LIKE ? OR brand LIKE ? OR category LIKE ? LIMIT 10',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const category = req.params.category;
    const products = await db.all('SELECT * FROM products WHERE category = ? ORDER BY rating DESC', [category]);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory
};
