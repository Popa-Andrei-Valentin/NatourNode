const express = require("express");

const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

// Merge params permits this router to access params from another routes (outside from its scope).
const router = express.Router() ;

router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingController.getCheckoutSesssion
);

module.exports = router;