const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const app = require("./app");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})

// Unhandled Rejections ( errors outside Express ) protocol.
process.on("unhandledRejection", err => {
  // console.log(err.name, err.message);
  console.log("Unhandled rejection ! Shutting down....")
  server.close(() => {
    process.exit(1);
  })
})