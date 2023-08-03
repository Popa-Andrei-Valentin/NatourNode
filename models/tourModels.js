const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true
  },
  duration : {
    type: Number,
    required: [true, "A duration must be specified"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A maxGroupSize must be specified"]
  },
  difficulty: {
    type: String,
    required: [true, "A difficulty must be specified"]
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 39.99
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A summary must be provided"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"]
  },
  images: {
    type: [String] // ==> an array of strings
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: {
    type: [Date]
  }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;