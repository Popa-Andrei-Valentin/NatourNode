const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

handleDuplicateFieldError = err => {
  const field = Object.keys(err.keyPattern)[0];
  const message = `The field '${field}' cannot have the value:'${err.keyValue[field]}', because it is already registered!'`
  return new AppError(message, 400);
}

handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data -> ${errors.join(". ")}`
  return new AppError(message, 400);
}
const sendErrorDev =  (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProduction = (err, res) => {
  /**
   * Complex error, not to be sent to the user as is.
   */
  if (!err.isOperational) {
    // 1. Log the error.
    console.error("ERROR:", err);

    // 2.Send generic message.
    return res.status(500).json({
      status: "fail",
      message: "Ups! Something went wrong, try again..."
    })
  }

  /**
   * Operational error, trusted to be sent to the user as is.
   */
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err};

    if (err.stack.startsWith("CastError")) error = handleCastErrorDB(error);

    // Handle duplicate attribute/field errors..
    if (err.code) error = handleDuplicateFieldError(error);

    // Handle validation errors..
    if (err.name === "ValidationError") error = handleValidationErrorDB(error)

    sendErrorProduction(error, res);
  }
}