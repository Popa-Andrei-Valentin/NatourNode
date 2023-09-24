import * as path from "path";
import express from "express";
import * as fs from "fs";
import * as morgan from "morgan";
import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import { json } from 'express';
import AppError from './utils/appError.js';
import tourRouter from "./routes/tourRoutes.js"
import userRouter from "./routes/userRoutes.js"
import reviewRouter from "./routes/reviewRoutes.js"
import globalErrorController from "./controllers/errorController.js"
import { fileURLToPath } from 'url';


const app = express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// PUG Engine setup.
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// 1) GLOBAL MIDDLEWARE
// SET Security HTTP headers.
app.use(helmet())

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
app.get("/", (req, res) => {
  res.status(200).render("base", {
    tour: "The Forest Hiker",
    user: "Andrei"
  });
})

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handle unknown routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
})

app.use(globalErrorController)

export default app;