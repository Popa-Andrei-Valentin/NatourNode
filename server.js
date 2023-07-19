const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const app = require("./app");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const tourSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true
    },
    rating: {
      type: Number,
      required: [true, "A tour must have a rating"]
    },
    price: {
      type: Number,
      default: 39.99
    },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "Grand Canyon Adventure",
  rating: 7.9
})

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => console.log("Error ❌", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})