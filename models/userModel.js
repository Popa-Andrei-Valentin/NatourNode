const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs")

// name, email, photo, password, passConfirm.
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "User must have a name !"],
    maxlength:[40, "User name must have less than 40 characters"],
    minlength:[1, "User name must have more than 1 character "],
    validate: {
      validator: (val) => {
        return validator.isAlpha(val, ["en-US"], {ignore: " "})
      },
      message: "User name must ONLY contain letters !"
    }
  },
  email:{
    type: String,
    required: [true, "User must have an email !"],
    unique: true,
    lowercase: true,
    validate: {
      validator: (val) => {
        return validator.isEmail(val)
      },
      message: "User email is not valid !"
    }
  },
  photo: String,
  password: {
    type: String,
    required: [true, "User must have a password !"],
    maxlength:[40, "User name must have less than 40 characters"],
    minlength:[5, "User password must have more than 5 character"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE or SAVE !
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords do not match."
    }
  }
})

// Password encryption.
userSchema.pre("save", async function(next) {

  // If password field is not modified, exit middleware.
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;