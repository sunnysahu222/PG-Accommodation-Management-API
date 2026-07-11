// This MUST be registered last, after all routes, in app.js.
// Express recognizes it as an error handler because it takes 4 arguments.
// Every `next(err)` call anywhere in the app ends up here.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

// Catches requests to routes that don't exist (404).
export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
