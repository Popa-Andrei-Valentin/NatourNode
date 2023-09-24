import Tour from "../models/tourModels.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
import AppError from '../utils/appError.js';

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

export const getAllTours = factory.getAll(Tour);
export const getSpecificTour = factory.getOne(Tour, { path:"reviews" });
export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//
//   if(!tour) {
//     return next(new AppError("No tour found with that ID", 404))
//   }
//
//   res.status(200).json({
//     status: "Success",
//     data: {
//       tour
//     }
//   })
// });

export const getTourStats =  catchAsync(async (req, res, next) => {
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

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
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

export const getToursWithin = catchAsync(async (req, res, next) => {
   const {distance, latlng, unit} = req.params;
   const [lat, lng] = latlng.split(",");
   const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

   if(!lat || !lng) {
     next(
       new AppError(
          "Please provide latitude and longitude in the format: lat,lng.",
          400
       )
     )
   }

   console.log({distance, lat, lng, unit});
   const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius ] } } })

   res.status(200).json({
     status: "success",
     results: tours.length,
     data: {
       data: tours
     }
   })
})

export const getDistances = catchAsync(async (req, res, next) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(",");

  const multipler = unit === "mi" ? 0.000621371 : 0.001

  if(!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format: lat,lng.",
        400
      )
    )
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near:{
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance",
        distanceMultiplier: multipler
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: "success",
    data: {
      data: distances
    }
  })
})