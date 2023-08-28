const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj,...allowedFileds) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  })
  return newObj;
}

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

exports.updateMe = catchAsync(async(req, res, next) => {
  // Always keep separated the methods that update the password and other user information !

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) return next(new AppError("This route is not for password updates. Please use: '/updateMyPassword'", 400));

  // 2) Filtered out unwanted fields name
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document that are not allowed to be updated.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  })
})

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