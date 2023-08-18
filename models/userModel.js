const mongoose = require("mongoose");
const validator = require('validator');

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
    required: [true, "Please confirm your password"]
  }
})

const User = mongoose.model("User", userSchema);

module.exports = User;