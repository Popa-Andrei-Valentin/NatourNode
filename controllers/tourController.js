const Tour = require("../models/tourModels");

exports.getAllTours = async (req, res) => {
  try {
    // 1. Build the query.
      // a) Filtering
    const queryObj = {...req.query};
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(field => delete queryObj[field]);
      // b) Advanced Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    // c) Prepare query
    let query = Tour.find(JSON.parse(queryString));
    // d) Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort("-createdAt"); // Default sorting
    }
    // 2. Execute the query.
    const tours = await query

    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err
    })
  }
};

exports.getSpecificTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

      res.status(200).json({
        status: "Succes",
        data: {
          tour
        }
      });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err
    })
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    })

  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err
    })
  }
}