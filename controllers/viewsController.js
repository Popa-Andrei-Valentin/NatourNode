const Tour = require("../models/tourModels");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  console.log(tours)
  // 3) Render template using the tour data from step #1
  res.status(200).render('overview', {
    title: "All tours",
    tours: tours,
  });
})

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: "The Forest Hiker Tour"
  });
}