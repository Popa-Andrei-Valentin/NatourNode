import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory"

const filterObj = (obj,...allowedFileds) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  })
  return newObj;
}

/**
 * Update current User information (expect password).
 */
export const updateMe = catchAsync(async(req, res, next) => {
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

/**
 * Delete current User.
 */
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status:"success",
    data:null
  })
})

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

export const createUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress. Please use /signUp instead'
  })

}
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
// Do NOT update passwords with this.
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);