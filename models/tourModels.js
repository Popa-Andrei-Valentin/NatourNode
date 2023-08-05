const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
  // Schema definition object.
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true
  },
  slug: {
    type: String
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
  },
  secretTour:{
    type: Boolean,
    default: false
  }
},
{
  // Schema options object
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
  });

// Virtual properties.
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre("save", function(next) {
//   // This middleware is called right before we save the data to the DB.
//   this.slug = slugify(this.name, {lower: true});
//   next();
// });

// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next()
// })

// QUERY MIDDLEWARE
// tourSchema.pre("find", function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now()
  next();
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took: ${Date.now() - this.start} ms`)
  // console.log(docs);
  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({$match:{secretTour: {$ne: true}}})
  next();
})

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;