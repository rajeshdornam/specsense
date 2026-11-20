const db = require('../database/db');
const { calculateValueForMoney } = require('../algorithms/valueScore');
const { evaluateRecommendation } = require('../algorithms/recommendation');

const SPEC_FIELDS = [
  { key: 'processor', label: 'Processor' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'display', label: 'Display Size' },
  { key: 'display_type', label: 'Display Type' },
  { key: 'refresh_rate', label: 'Refresh Rate' },
  { key: 'battery', label: 'Battery Capacity' },
  { key: 'charging_speed', label: 'Charging Speed' },
  { key: 'camera', label: 'Main Camera' },
  { key: 'front_camera', label: 'Front Camera' },
  { key: 'operating_system', label: 'Operating System' },
  { key: 'benchmark_score', label: 'Benchmark Score' },
  { key: 'weight', label: 'Weight' },
  { key: 'connectivity', label: 'Connectivity' }
];

async function compareProducts(req, res, next) {
  try {
    const idsQuery = req.query.ids;
    if (!idsQuery) {
      return res.status(400).json({ success: false, error: 'Query parameter "ids" is required (e.g. ?ids=1,2)' });
    }

    const ids = idsQuery.split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));

    if (ids.length < 2 || ids.length > 3) {
      return res.status(400).json({ success: false, error: 'Please select 2 or 3 products for comparison' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const products = await db.all(`SELECT * FROM products WHERE id IN (${placeholders})`, ids);

    // Sort to match requested order
    const sortedProducts = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

    if (sortedProducts.length < 2) {
      return res.status(404).json({ success: false, error: 'Could not find enough matching products' });
    }

    // Enhance each product with value score and recommendation
    const enhancedProducts = await Promise.all(sortedProducts.map(async (prod) => {
      const vfm = calculateValueForMoney(prod);
      const history = await db.all('SELECT price, recorded_at FROM price_history WHERE product_id = ?', [prod.id]);
      const rec = evaluateRecommendation(history, prod.current_price);
      return {
        ...prod,
        valueForMoney: vfm,
        recommendation: rec
      };
    }));

    // Build specification comparison matrix with difference detection
    const specMatrix = SPEC_FIELDS.map(spec => {
      const values = enhancedProducts.map(p => p[spec.key] ?? 'N/A');
      // Normalize values for string comparison
      const normalizedVals = values.map(v => String(v).trim().toLowerCase());
      const isDifferent = new Set(normalizedVals).size > 1;

      return {
        key: spec.key,
        label: spec.label,
        values,
        isDifferent
      };
    });

    // Best in class badges
    const bestPrices = [...enhancedProducts].sort((a, b) => a.current_price - b.current_price);
    const bestBenchmarks = [...enhancedProducts].sort((a, b) => (b.benchmark_score || 0) - (a.benchmark_score || 0));
    const bestVFM = [...enhancedProducts].sort((a, b) => b.valueForMoney.totalScore - a.valueForMoney.totalScore);

    const highlights = {
      lowestPriceId: bestPrices[0]?.id,
      highestPerformanceId: bestBenchmarks[0]?.id,
      bestValueId: bestVFM[0]?.id
    };

    res.json({
      success: true,
      data: {
        products: enhancedProducts,
        specMatrix,
        highlights
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  compareProducts
};
