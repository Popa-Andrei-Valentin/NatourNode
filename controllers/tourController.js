const Tour = require("../models/tourModels");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

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