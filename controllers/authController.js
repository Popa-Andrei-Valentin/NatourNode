/** All the functions related to the authentication can be found here... **/
const { promisify } = require("util")
const jwt = require("jsonwebtoken")
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError")
const sendEmail = require("./../utils/email")

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "succes",
    token,
    data: {
      user: newUser
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and passsword exist.
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400))
    }
  // 2) Check if user exists and password is correct.
    const user = await User.findOne({ email }).select("+password")

    if(!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
  // 3) If everything ok, send tolen to client.
    const token = signToken(user._id)
    res.status(200).json({
      status: "succes",
      token
    })
})

/** Middleware that ensures user is authenticated **/
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting JWT token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("You are not logged in! Please log in"), 401);
  // 2) Verify JWT token
  const decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if users still exists.
  let freshUser = await User.findById(decodedData.id);

  if (!freshUser) return next(new AppError("The user belonging to this token no longer exists !", 401));
  // 4) Check if user changed password after the JWT token was issued
  if (freshUser.changedPasswordAfter(decodedData.iat)) {
    return next(new AppError("User recently changed password! Please log in again !", 401));
  }

  // Grant access to protected route.
  req.user = freshUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email.
    const user = await User.findOne({ email: req.body.email });

    // If no user was found throw error.
    if (!user) return next(new AppError("There is no user with email adress.", 404));

  // 2) Generate random reset token.
    const resetToken = user.createPasswordResetToken();

    // Ensures that no field validation is called and avoid returning errors to the user.
    await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email.
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password ? Submit a new patch request with your new password and passwordConfirm to: ${resetUrl}.\n \
                            If you didn't forgot your password please ignore this email`

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min )",
        message
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to the email !"
      })
    } catch (err) {
      /** In case there is an error when sending the email:
       * - we need to remove the reset tokens;
       * - and notify the user that there's been an error;
       * @type {undefined}
       */
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("There was an error sending the email. Try again later!", 500))
    }

})

exports.resetPassword = (req, res, next) => {}