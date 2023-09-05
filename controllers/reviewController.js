const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");    
const APIFeatures = require('../utils/apiFeatures');
const Review = require("../models/reviewModel");

exports.getAllReviews = catchAsync( async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'succes',
    results: reviews.length,
    data: {
      reviews
    }
  });
})

exports.createNewReview = catchAsync( async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status:"success",
    data:{
      review: newReview
    }
  })
})