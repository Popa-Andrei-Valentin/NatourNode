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
    sendErrorProduction(err, res);
  }
}