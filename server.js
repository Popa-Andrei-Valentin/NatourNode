const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const app = require("./app");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const tourSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true
    },
    rating: {
      type: Number,
      default: 6.9
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
})

const Tour = mongoose.model("Tour", tourSchema)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})