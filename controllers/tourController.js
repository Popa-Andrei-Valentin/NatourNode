const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'succes',
    results: tours.length,
    data: {
      tours
    }
  })
};

exports.getSpecificTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: "error",
      message: "No tour was found with this parameter: " + id
    })
  }

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

exports.createTour = (req, res) => {

  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({id: newId}, req.body)

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    })
  })
};

exports.updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: "error",
      message: "Tour with this id was not found"
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated properties here:"
    }
  })
};