const express = require('express');
const fs = require('fs');

const app = express()

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({
//       message: 'Hello from the server side',
//       app: "Natour"
//     });
// })
//
// app.post("/", (req, res) => {
//   res.send("You can post here ?")
// })

/** Handling GET requests */
const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  if (tours.length > 0) {
    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours
      }
    })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
})