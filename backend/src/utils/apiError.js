// Wraps an async controller so any thrown error or rejected promise
// is automatically forwarded to Express's error-handling middleware,
// instead of crashing the server or requiring try/catch in every controller.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// A custom error class that carries an HTTP status code.
// Lets controllers do: throw new ApiError(404, 'PG not found')
// and have the error middleware know exactly what status to send.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
