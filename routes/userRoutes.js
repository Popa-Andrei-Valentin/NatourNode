const express = require('express');
const fs = require('fs');

const router = express.Router()

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))

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

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router