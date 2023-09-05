const express = require('express')

const tourController = require('./../controllers/tourController');
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router()

// router.param('id', tourController.validateId);

router
  .route('/top-5-budget')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tours-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin","lead-guide"),
    tourController.deleteTour);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createNewReview
  )
module.exports = router