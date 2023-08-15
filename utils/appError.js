class AppError extends Error {
  constructor(errorMessage, statusCode) {
    super();
    this.message = errorMessage;
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor) // in order to avoid AppError class from appearing in the error stack trace.
  }
}

module.exports = AppError;