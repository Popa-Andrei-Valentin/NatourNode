const Tour = require("../models/tourModels");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    // Execute the query.
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    const tours = await features.query

    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: {
        tours
      }
    });
});

exports.getSpecificTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

      res.status(200).json({
        status: "Succes",
        data: {
          tour
        }
      });
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    })
  }
  // try {
  //
  // } catch (err) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: err
  //     })
  //   }
  // }
);

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    })
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    })
});

exports.getTourStats =  catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper:'$difficulty' },
          numTours: { $sum: 1 }, // Add 1 for each documents => 9 documents means 9*1 = 9 :)
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg:"$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },

        }
      },
      {
        $sort: { avgPrice: 1 } // 1 for ascending
      },
      // {
      //   $match: { minPrice: { $ne: 497 } }
      // }
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        stats
      }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year + 1}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStart: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      {
        $addFields: { month: "$_id"}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStart: -1 }
      },
      {
        $limit: 3
      }
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        plan
      }
    })
})