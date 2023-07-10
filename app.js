const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

app.use((req,res,next) => {
  console.log("Hello from the middleware")
  next()
})

app.use((req,res,next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'succes',
    results: tours.length,
    data: {
      tours
    }
  })
}

const getSpecificTour = (req, res) => {
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
}

const createTour = (req, res) => {

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
}

const updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: "error",
      message: "Tour with this id was not found"
    })
  }

  res.status(200).json({
    status: "succes",
    data: {
      tour: "Updated properties here:"
    }
  })
}

/** Handling GET requests */
const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  if (tours.length > 0) {
    getAllTours(req, res)
  }
})

/** Handling GET requests with parameters */
app.get('/api/v1/tours/:id', getSpecificTour);

/** Handling POST requests */
app.post('/api/v1/tours', createTour);

/** Handling PATCH requests */
app.patch('/api/v1/tours/:id', updateTour);

// Example of chaining events.
app.route('/api/v1/tours').get(getAllTours).post(createTour);

const port = 3000
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})