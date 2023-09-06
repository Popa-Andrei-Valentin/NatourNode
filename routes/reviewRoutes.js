const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

// Merge params permits this router to access params from another routes (outside from its scope).
const router = express.Router({mergeParams: true});

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createNewReview
  );

router
  .route("/:id")
  .patch(reviewController.updateReveiw)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview)
  .get(
    authController.restrictTo("user", "admin"),
    reviewController.getReview);

module.exports = router;