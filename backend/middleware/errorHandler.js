function errorHandler(err, req, res, next) {
  console.error(`[API ERROR] ${req.method} ${req.url}:`, err);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
