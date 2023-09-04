// review / rating / createdAt / ref to tour / ref to user who wrote it.
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "If you want to submit a review, there must be one written!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // no to be displayed.
  },
  tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."]
    },
  user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to an user."]
    }
},
{
    // Schema options object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;