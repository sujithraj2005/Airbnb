const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const Listing = require("../modles/listing.js");
const { isLogedIn, isOwned, validateListing } = require("../middelware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postCreate)
  );
//create route
router.get("/new", isLogedIn, wrapAsync(listingController.renderCreate));

router
  .route("/:id")
  .get(wrapAsync(listingController.renderShow))
  .put(
    upload.single("listing[image]"),
    validateListing,
    isOwned,
    wrapAsync(listingController.putUpdate)
  )
  .delete(isLogedIn, isOwned, wrapAsync(listingController.destorListing));

//update route
router.get(
  "/:id/edit",
  isLogedIn,
  isOwned,
  wrapAsync(listingController.renderUpdate)
);

module.exports = router;
