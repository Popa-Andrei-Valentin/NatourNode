const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

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
  role: {
    type: String,
    enum:["user", "guide", "lead-guide", "admin"],
    default:"user"
  },
  password: {
    type: String,
    required: [true, "User must have a password !"],
    maxlength:[40, "User name must have less than 40 characters"],
    minlength:[5, "User password must have more than 5 character"],
    select: false
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

// Password encryption.
userSchema.pre("save", async function(next) {

  // If password field is not modified, exit middleware.
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  console.log("pass confirm", this.passwordConfirm);
  next()
})

userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  console.log(this);
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
    console.log(changedTimestamp, JWTTimestamp)

    return JWTTimestamp < changedTimestamp;
  }


  // FALSE means not changed.
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');

  console.log({resetToken}, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // expires after 10 min;

  return resetToken
}

const User = mongoose.model("User", userSchema);

module.exports = User;