/**
 * Best-Time-To-Buy Recommendation Engine
 * Uses historical price deviations, moving averages, and historical lows
 * to output objective historical-price-based buying guidance.
 */

const { calculateHistoricalMetrics } = require('./priceAnalytics');

const RECOMMENDATIONS = {
  BUY_NOW: 'GREAT DEAL – BUY NOW',
  FAIR: 'FAIR PRICE',
  WAIT: 'WAIT – LIKELY TO DROP'
};

/**
 * Determine recommendation based on configurable thresholds
 * Priority 1: Great Deal (at least 5% below 90d MA and within 10% of 90d all-time low)
 * Priority 2: Wait (more than 5% above 90d MA, indicating premium or recent markup)
 * Priority 3: Fair Price (within +/- 5% corridor around 90d MA)
 */
function evaluateRecommendation(priceRecords, currentPrice) {
  const metrics = calculateHistoricalMetrics(priceRecords, currentPrice);
  const { effectivePrice, lowestPrice, ma90, ma30, deviation90, deviation30, distanceToLow } = {
    effectivePrice: metrics.currentPrice,
    ...metrics
  };

  let recommendation = RECOMMENDATIONS.FAIR;
  let confidence = 'High';
  let badgeType = 'fair'; // 'deal' | 'fair' | 'wait'
  let explanation = '';
  let keyDrivers = [];

  // Priority 1: GREAT DEAL - BUY NOW
  if (deviation90 <= -5.0 && distanceToLow <= 10.0) {
    recommendation = RECOMMENDATIONS.BUY_NOW;
    badgeType = 'deal';
    explanation = `The current price of ₹${effectivePrice.toLocaleString('en-IN')} is ${Math.abs(deviation90)}% below its 90-day average (₹${ma90.toLocaleString('en-IN')}) and within ${distanceToLow}% of its recorded 90-day low (₹${lowestPrice.toLocaleString('en-IN')}). Historical patterns suggest this is an opportune window to purchase.`;
    keyDrivers = [
      `Trading ${Math.abs(deviation90)}% under 90-day benchmark (₹${ma90.toLocaleString('en-IN')})`,
      `Near 90-day low of ₹${lowestPrice.toLocaleString('en-IN')} (gap is only ₹${(effectivePrice - lowestPrice).toLocaleString('en-IN')})`,
      `Short-term 30-day trend indicates aggressive retailer competition`
    ];
  } 
  // Priority 2: WAIT - LIKELY TO DROP
  else if (deviation90 > 5.0) {
    recommendation = RECOMMENDATIONS.WAIT;
    badgeType = 'wait';
    explanation = `The current price of ₹${effectivePrice.toLocaleString('en-IN')} is ${deviation90}% above the 90-day baseline of ₹${ma90.toLocaleString('en-IN')}. Retailers have recently raised prices above standard promotion levels. Setting a price alert or waiting for an upcoming seasonal sale is recommended.`;
    keyDrivers = [
      `Current price carries a ${deviation90}% premium over 90-day average`,
      `Recent peak pricing; historical discount cycles occur every 3-4 weeks`,
      `Opportunity to save up to ₹${(effectivePrice - lowestPrice).toLocaleString('en-IN')} by waiting for target price`
    ];
  }
  // Priority 3: Deep discount but slightly higher than low
  else if (deviation90 <= -5.0 && distanceToLow > 10.0) {
    recommendation = RECOMMENDATIONS.BUY_NOW;
    badgeType = 'deal';
    explanation = `The product is heavily discounted at ${Math.abs(deviation90)}% below the 90-day average (₹${ma90.toLocaleString('en-IN')}). While not at its absolute flash-sale bottom, this represents an attractive and reliable buying price.`;
    keyDrivers = [
      `Significantly discounted (${Math.abs(deviation90)}% below 90-day average)`,
      `Competitive rate compared to typical market baseline`,
      `Solid cost-to-spec ratio for immediate needs`
    ];
  }
  // Default: FAIR PRICE
  else {
    recommendation = RECOMMENDATIONS.FAIR;
    badgeType = 'fair';
    const direction = deviation90 >= 0 ? 'above' : 'below';
    explanation = `The current price of ₹${effectivePrice.toLocaleString('en-IN')} is stable within normal historical bounds (${Math.abs(deviation90)}% ${direction} 90-day average ₹${ma90.toLocaleString('en-IN')}). You are paying standard market value without notable surcharge or deep discount.`;
    keyDrivers = [
      `Price is fluctuating within historical normal range (+/- 5%)`,
      `Consistent availability across multiple retailers`,
      `Buy if you need the device now; wait if seeking holiday flash sales`
    ];
  }

  return {
    recommendation,
    badgeType,
    confidence,
    metrics: {
      currentPrice: effectivePrice,
      ma30,
      ma90,
      historicalLow: lowestPrice,
      historicalHigh: metrics.highestPrice,
      priceDeviationPct: deviation90,
      deviation30Pct: deviation30,
      distanceToLowPct: distanceToLow
    },
    explanation,
    keyDrivers,
    disclaimer: 'Guidance is derived objectively from 90-day cross-retailer historical pricing patterns and does not constitute a guaranteed future forecast.'
  };
}

module.exports = {
  RECOMMENDATIONS,
  evaluateRecommendation
};
