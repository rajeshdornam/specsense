const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./database/db');
const errorHandler = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const compareRoutes = require('./routes/compareRoutes');
const priceRoutes = require('./routes/priceRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const { getProductValueScore } = require('./controllers/recommendationController');
const alertRoutes = require('./routes/alertRoutes');
const miscRoutes = require('./routes/miscRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SpecSense API Backend'
  });
});

// Mount REST API Routes
app.use('/api/products', productRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.get('/api/value-score/:productId', getProductValueScore);
app.use('/api/alerts', alertRoutes);
app.use('/api', miscRoutes);

// Static frontend serving if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log('[SpecSense] Serving production frontend build from:', frontendDist);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await db.init();
    console.log('[SpecSense] Database initialized successfully.');

    app.listen(PORT, () => {
      console.log(`[SpecSense] Application is live on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[SpecSense] Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
