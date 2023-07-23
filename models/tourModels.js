const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true
  },
  rating: {
    type: Number,
    required: [true, "A tour must have a rating"]
  },
  price: {
    type: Number,
    default: 39.99
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;