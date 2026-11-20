/**
 * Value-For-Money (VFM) Scoring Algorithm
 * Normalizes technical specifications and price efficiency to compute
 * an index between 0 and 100 with categorical breakdowns.
 */

// Category specific weight distributions (sum to 1.0)
const CATEGORY_WEIGHTS = {
  Smartphones: {
    performance: 0.25,
    display: 0.20,
    camera: 0.20,
    battery: 0.15,
    priceEfficiency: 0.20
  },
  Laptops: {
    performance: 0.35,
    display: 0.20,
    camera: 0.05, // webcam
    battery: 0.15,
    priceEfficiency: 0.25
  },
  Headphones: {
    performance: 0.20, // Audio processing chip
    display: 0.05, // controls/sensors
    camera: 0.20, // Microphone array & ANC quality
    battery: 0.25, // Playtime battery
    priceEfficiency: 0.30
  },
  Smartwatches: {
    performance: 0.20,
    display: 0.25,
    camera: 0.15, // Biometric sensors
    battery: 0.20,
    priceEfficiency: 0.20
  }
};

const DEFAULT_WEIGHTS = {
  performance: 0.25,
  display: 0.20,
  camera: 0.15,
  battery: 0.15,
  priceEfficiency: 0.25
};

/**
 * Normalization helper - clamps a value between min and max and scales to 0 - 100
 */
function normalize(val, min, max) {
  if (val <= min) return 0;
  if (val >= max) return 100;
  return Math.round(((val - min) / (max - min)) * 100);
}

/**
 * Parse numeric RAM (in GB)
 */
function extractRamGB(ramStr) {
  if (!ramStr || ramStr === 'N/A') return 4;
  const match = ramStr.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : 4;
}

/**
 * Parse numeric Storage (in GB)
 */
function extractStorageGB(storageStr) {
  if (!storageStr || storageStr === 'N/A') return 64;
  if (storageStr.includes('TB')) {
    const match = storageStr.match(/(\d+)\s*TB/i);
    return match ? parseInt(match[1], 10) * 1024 : 1024;
  }
  const match = storageStr.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : 128;
}

/**
 * Calculate component scores for a product
 */
function evaluateProductComponents(product) {
  const category = product.category || 'Smartphones';

  // 1. Performance component (Benchmark score + RAM/Storage)
  // Benchmarks range roughly 500,000 to 2,500,000
  const benchmarkRaw = product.benchmark_score || 1000000;
  const benchmarkNorm = normalize(benchmarkRaw, 600000, 2500000);
  const ramGB = extractRamGB(product.ram);
  const ramNorm = normalize(ramGB, 2, 32);
  const performanceScore = Math.round(benchmarkNorm * 0.75 + ramNorm * 0.25);

  // 2. Display & Design component
  let displayScore = 65;
  const dispText = ((product.display || '') + ' ' + (product.display_type || '')).toLowerCase();
  if (dispText.includes('oled') || dispText.includes('amoled') || dispText.includes('retina')) {
    displayScore += 20;
  }
  if (product.refresh_rate && product.refresh_rate.includes('120')) {
    displayScore += 12;
  }
  displayScore = Math.min(100, Math.max(40, displayScore));

  // 3. Battery & Power component
  let batteryScore = 60;
  const battText = (product.battery || '').toLowerCase();
  const chargeText = (product.charging_speed || '').toLowerCase();
  if (battText.includes('5400') || battText.includes('18 hrs') || battText.includes('30 hours') || battText.includes('100 hours')) {
    batteryScore += 22;
  } else if (battText.includes('4500') || battText.includes('5000') || battText.includes('24 hours')) {
    batteryScore += 14;
  }
  if (chargeText.includes('100w') || chargeText.includes('65w') || chargeText.includes('fast') || chargeText.includes('magsafe')) {
    batteryScore += 15;
  }
  batteryScore = Math.min(100, Math.max(40, batteryScore));

  // 4. Camera & Sensors component
  let cameraScore = 60;
  const camText = (product.camera || '').toLowerCase();
  if (camText.includes('periscope') || camText.includes('hasselblad') || camText.includes('3x telephoto') || camText.includes('8 microphones')) {
    cameraScore += 30;
  } else if (camText.includes('50mp') || camText.includes('48mp') || camText.includes('6 microphones')) {
    cameraScore += 20;
  } else if (camText.includes('ecg') || camText.includes('bioactive')) {
    cameraScore += 22;
  }
  cameraScore = Math.min(100, Math.max(30, cameraScore));

  // 5. Price Efficiency component
  // High specs at lower price yield higher price efficiency
  // Category typical baseline medians:
  let medianPrice = 60000;
  if (category === 'Headphones') medianPrice = 24000;
  if (category === 'Smartwatches') medianPrice = 30000;
  if (category === 'Laptops') medianPrice = 90000;

  const currentPrice = product.current_price || medianPrice;
  // Raw spec aggregate
  const rawSpecTotal = (performanceScore + displayScore + batteryScore + cameraScore) / 4;
  // Ratio of spec aggregate relative to price index
  const priceRatio = (rawSpecTotal / (currentPrice / medianPrice));
  const priceEfficiencyScore = Math.min(100, Math.max(35, Math.round(priceRatio * 0.95)));

  return {
    performanceScore,
    displayScore,
    batteryScore,
    cameraScore,
    priceEfficiencyScore
  };
}

/**
 * Compute overall Value For Money (VFM) score
 */
function calculateValueForMoney(product) {
  const category = product.category || 'Smartphones';
  const weights = CATEGORY_WEIGHTS[category] || DEFAULT_WEIGHTS;
  const components = evaluateProductComponents(product);

  const rawScore = 
    components.performanceScore * weights.performance +
    components.displayScore * weights.display +
    components.cameraScore * weights.camera +
    components.batteryScore * weights.battery +
    components.priceEfficiencyScore * weights.priceEfficiency;

  const totalScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  // Tier classification
  let tier = 'Good Value';
  let tierColor = '#2563EB';
  if (totalScore >= 85) {
    tier = 'Exceptional Value';
    tierColor = '#15803D';
  } else if (totalScore >= 75) {
    tier = 'High Value';
    tierColor = '#2563EB';
  } else if (totalScore >= 60) {
    tier = 'Moderate Value';
    tierColor = '#D97706';
  } else {
    tier = 'Premium Surcharge';
    tierColor = '#DC2626';
  }

  return {
    productId: product.id,
    productName: product.name,
    category,
    currentPrice: product.current_price,
    totalScore,
    tier,
    tierColor,
    weights,
    breakdown: [
      {
        metric: 'Performance & Architecture',
        score: components.performanceScore,
        weightPct: Math.round(weights.performance * 100),
        description: 'Processor benchmark efficiency and RAM/storage throughput'
      },
      {
        metric: 'Display & Visuals',
        score: components.displayScore,
        weightPct: Math.round(weights.display * 100),
        description: 'Panel technology (OLED/Retina), refresh rate, and resolution'
      },
      {
        metric: 'Battery & Charging Speed',
        score: components.batteryScore,
        weightPct: Math.round(weights.battery * 100),
        description: 'Cell endurance and fast-charging capabilities'
      },
      {
        metric: 'Optics & Sensing Suite',
        score: components.cameraScore,
        weightPct: Math.round(weights.camera * 100),
        description: 'Sensor resolution, multi-microphone ANC, or biometric tracking'
      },
      {
        metric: 'Price-to-Spec Efficiency',
        score: components.priceEfficiencyScore,
        weightPct: Math.round(weights.priceEfficiency * 100),
        description: 'Spec value received per rupee invested against category medians'
      }
    ],
    formulaExplanation: 'Normalized multi-factor model calculating weighted technical prowess relative to contemporary street market pricing.'
  };
}

module.exports = {
  calculateValueForMoney,
  CATEGORY_WEIGHTS
};
