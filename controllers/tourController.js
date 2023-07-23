const Tour = require("../models/tourModels");

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'succes',
    // results: tours.length,
    // data: {
    //   tours
    // }
  })
};

exports.getSpecificTour = (req, res) => {
  const tour = tours.find(el => el.id === Number(req.params.id))

  if (tours.length > 0) {
    res.status(200).json({
      status: 'succes',
      data: {
        tour
      }
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated properties here:"
    }
  })
};