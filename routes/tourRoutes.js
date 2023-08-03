const express = require('express')

const tourController = require('./../controllers/tourController');

const router = express.Router()

// router.param('id', tourController.validateId);

router
  .route('/top-5-budget')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router