const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log the full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
