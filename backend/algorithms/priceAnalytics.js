/**
 * Price Analytics Module
 * Calculates moving averages, min/max bounds, volatility and deviations.
 */

function calculateMovingAverage(prices, days) {
  if (!prices || prices.length === 0) return 0;
  // Sort descending by date or assume sorted ascending
  const slice = prices.slice(-days);
  if (slice.length === 0) return 0;
  const sum = slice.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : curr.price), 0);
  return Math.round(sum / slice.length);
}

function calculateHistoricalMetrics(priceRecords, currentPrice) {
  if (!priceRecords || priceRecords.length === 0) {
    return {
      currentPrice: currentPrice || 0,
      lowestPrice: currentPrice || 0,
      highestPrice: currentPrice || 0,
      ma30: currentPrice || 0,
      ma90: currentPrice || 0,
      deviation90: 0,
      deviation30: 0,
      totalDataPoints: 0
    };
  }

  // Extract raw prices sorted chronologically
  const sorted = [...priceRecords].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  const rawPrices = sorted.map(r => r.price);

  const lowestPrice = Math.min(...rawPrices);
  const highestPrice = Math.max(...rawPrices);
  const effectiveCurrentPrice = currentPrice || rawPrices[rawPrices.length - 1];

  const ma30 = calculateMovingAverage(rawPrices, 30);
  const ma90 = calculateMovingAverage(rawPrices, 90);

  // Deviation (%) = ((Current Price - Average Price) / Average Price) * 100
  const deviation90 = ma90 > 0 ? Number((((effectiveCurrentPrice - ma90) / ma90) * 100).toFixed(2)) : 0;
  const deviation30 = ma30 > 0 ? Number((((effectiveCurrentPrice - ma30) / ma30) * 100).toFixed(2)) : 0;

  // Price distance to historical low (%)
  const distanceToLow = lowestPrice > 0 ? Number((((effectiveCurrentPrice - lowestPrice) / lowestPrice) * 100).toFixed(2)) : 0;

  return {
    currentPrice: effectiveCurrentPrice,
    lowestPrice,
    highestPrice,
    ma30,
    ma90,
    deviation90,
    deviation30,
    distanceToLow,
    totalDataPoints: priceRecords.length
  };
}

module.exports = {
  calculateMovingAverage,
  calculateHistoricalMetrics
};
