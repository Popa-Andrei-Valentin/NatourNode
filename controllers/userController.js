const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find()

  res.status(200).json({
    status: 'succes',
    results: user.length,
    data: {
      user
    }
  });
});

exports.getUser = (req, res) => {
  const id = Number(req.params.id)
  if (id > users.length) {
    res.status(404).json({
      status:'error',
      message:`There is no user with the following id: ${id}`
    });
  }

  const user = users[id];
  if (!user) {
    res.status(500).json({
      status:"error",
      message:"This route is not yet defined"
    })
  }
  res.status(200).json({
    status:'success',
    user
  })
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress'
  })
}