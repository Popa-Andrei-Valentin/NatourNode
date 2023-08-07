const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema({
  // Schema definition object.
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength:[40, "A tour name must have less than 40 characters "],
    minlength:[10, "A tour name must have more than 10 characters "],
    validate: {
      validator: validator.isAlpha,
      message: "Tour name must ONLY contain letters !"
    }
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
    required: [true, "A difficulty must be specified"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium, difficult"
}
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min:[1, "Rating must be above 1.0"],
    max:[5, "Rating must be below 5.0"]
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 39.99
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: "The priceDiscount ({VALUE}) cannot be greater than the price !"
    }
  },
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