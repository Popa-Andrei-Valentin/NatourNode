const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next) => {
  console.log("Hello from the middleware")
  next()
});

app.use((req,res,next) => {
  req.requestTime = new Date().toISOString()
  next()
});

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'succes',
    results: tours.length,
    data: {
      tours
    }
  })
};

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
};

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
};

const updateTour = (req, res) => {
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

const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))

const getAllUsers = (req, res) => {
  res.status(202).json({
    status: 'success',
    data: {
      users
    }
  });
};

const getUser = (req, res) => {
  const id = Number(req.params.id)
  if (id > users.length) {
    res.status(404).json({
      status:'error',
      message:`There is no user with the following id: ${id}`
    });
  }

  const user = users[id];

  res.status(200).json({
    status:'success',
    user
  })
};

const createUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}

const updateUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}

/** Handling GET requests */
const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  if (tours.length > 0) {
    getAllTours(req, res)
  }
});

// 3) ROUTES
const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('f/:id')
  .get(getSpecificTour)
  .patch(updateTour);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// 4) START SERVER
const port = 3000
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})