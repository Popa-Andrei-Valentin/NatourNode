// review / rating / createdAt / ref to tour / ref to user who wrote it.
const mongoose = require("mongoose");
const Tour = require("./tourModels");

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

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: "user",
    select: "name"
  })
  //   .populate({
  //   path:"tour",
  //   select:"name"
  // })


  next();
})


reviewSchema.statics.calcAverageRating = async function(tour) {
  const stats = await this.aggregate([
    {
      $match: {tour: tour}
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);
  await Tour.findByIdAndUpdate(tour, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  })
};

reviewSchema.post("save", function() {
  // This points to current review.
  this.constructor.calcAverageRating(this.tour)
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;