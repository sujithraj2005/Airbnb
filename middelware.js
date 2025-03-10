const Listing = require("./modles/listing.js");
const { listingSchema, reviewSchema } = require("./validationSchema.js");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./modles/reviews.js");

//check if loged in
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be loged in");

    res.redirect("/login");
  } else {
    next();
  }
};

//saving user from sessions to locals
module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.savedUrl = req.session.redirectUrl;
  }
  next();
};

//checking the owner of the listing
module.exports.isOwned = async (req, res, next) => {
  let id = req.params.id;
  let user = await Listing.findById(id);
  if (!user.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//review validations
module.exports.validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

//listing validations
module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

//checking the owner of the reviews
module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let user = await review.findById(reviewId);
  if (!user.author._id.equals(res.locals.user._id)) {
    req.flash("error", "you are not the author  of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
