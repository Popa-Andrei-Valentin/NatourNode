const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({
//       message: 'Hello from the server side',
//       app: "Natour"
//     });
// })
//
// app.post("/", (req, res) => {
//   res.send("You can post here ?")
// })

/** Handling GET requests */
const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  if (tours.length > 0) {
    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours
      }
    })
  }
})

/** Handling GET requests with parameters */
app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status:"error",
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
})

/** Handling POST requests */
app.post('/api/v1/tours', (req, res) => {

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
})

/** Handling PATCH requests */
app.patch('/api/v1/tours/:id', (req, res) => {
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
})


const port = 3000
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})