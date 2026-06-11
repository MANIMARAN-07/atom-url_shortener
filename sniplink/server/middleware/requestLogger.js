const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Capture the original end to measure duration
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(
      `${color}${req.method}${reset} ${req.path} → ${color}${res.statusCode}${reset} (${duration}ms)`
    );
    originalEnd.apply(res, args);
  };

  next();
};

module.exports = requestLogger;
