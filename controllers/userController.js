const User = require("../models/userModel");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const multer = require('multer');
const path = require('path');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) =>  {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

// const uploadPhoto = multer({ dest: "public/img/users" });

exports.uploadUserPhoto = upload.single("photo")

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.fileName = `user-${req.user.id}-${Date.now()}.jpeg`

  console.log("file",req.file.fileName);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.fileName}`);

  next();
})
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
exports.updateMe = catchAsync(async(req, res, next) => {
  // Always keep separated the methods that update the password and other user information !

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) return next(new AppError("This route is not for password updates. Please use: '/updateMyPassword'", 400));

  // 2) Filtered out unwanted fields name
  const filteredBody = filterObj(req.body, "name", "email");

  if (req.file) filteredBody.photo = req.file.fileName;

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
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status:"success",
    data:null
  })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status:'Error',
    message:'Route still in progress. Please use /signUp instead'
  })

}
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do NOT update passwords with this.
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);