const fs = require("fs");
const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const Tour = require("./../../models/tourModels")
const Review = require("./../../models/reviewModel")
const User = require("./../../models/userModel")

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const port = process.env.PORT || 3000;

// READ JSON FILE

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

// IMPORT DATA INTO DATABASE
const importData = async () => {
   try {
     // await Tour.create(tours)
     // await Review.create(reviews, { validateBeforeSave: false })
     await User.create(users, { validateBeforeSave: false })
     console.log("Data success fully loaded");
   } catch (err) {
     console.log(err)
   }
  process.exit()

}

// DELETE ALL DATA FROM DB
const deleteData = async() => {
  try {
    // await Tour.deleteMany()
    // await Review.deleteMany()
    await User.deleteMany()
    console.log("Data deleted from DB ");
  } catch (err) {
    console.log(err);
  }
  process.exit()
}

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData()
}

console.log(process.argv)