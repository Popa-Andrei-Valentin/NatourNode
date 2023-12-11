const path = require("path");
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController")
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const { json } = require("express");

const app = express();

// PUG Engine setup.
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// 1) GLOBAL MIDDLEWARE
// SET Security HTTP headers.
app.use(helmet());
app.use(cors());

// Development logging.
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

/** Limit the number of requests that can be made.
 * max -> maximum number of requests that can be made in the specified time window frame.
 * windowMs -> represents the time window frame in ms.
 * message -> the message sent when the limit is exceeded
 */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour !"
})

app.use("/api", limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser( ));

/**
 * Data sanitization against NoSQL query injection. (mongoDB queries)
 */
app.use(mongoSanitize());

/**
 * Data sanitization against XSS. (HTML elements)
 */
app.use(xss());

/**
 * Prevent parameter pollution.
 */
app.use(hpp({
  whitelist: [
    "duration",
    "ratingsAverage",
    "ratingsQuantity",
    "price",
    "maxGroupSize",
    "difficulty"
  ]
}));

// Test middleware used for debugging and optimisation. TODO: Remove it if not needed anymore.
app.use((req,res,next) => {
  req.requestTime = new Date().toISOString()
  next()
});

// 2) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handle unknown routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
})

app.use(globalErrorController)

module.exports = app;