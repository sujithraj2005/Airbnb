const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { isLogedIn, isAuthor, validateReview } = require("../middelware.js");
const reviewController = require("../controllers/reviews.js");

//review route
router.post(
  "/",
  validateReview,
  isLogedIn,
  wrapAsync(reviewController.newReview)
);

//reviews delete route
router.delete(
  "/:reviewId",
  isLogedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
