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

  if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  } else {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    })
  }
};

reviewSchema.post("save", function() {
  // This points to current review.
  this.constructor.calcAverageRating(this.tour)
})

// MW that is called before findOneAndUpdate/ findOneAndDelete.
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  console.log("**r", this.r);
  next()
})
reviewSchema.post(/^findOneAnd/, async function() {
  // this.findOne(); does NOT work here, the query has already executed !
  await this.r.constructor.calcAverageRating(this.r.tour);
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;