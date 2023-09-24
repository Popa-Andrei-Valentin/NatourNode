import * as express from "express";
import * as reviewController from "./../controllers/reviewController.js";
import * as authController from "./../controllers/authController.js"

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

export default router;