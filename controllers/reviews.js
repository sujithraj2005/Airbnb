const Listing = require("../modles/listing.js");
const review = require("../modles/reviews.js");

module.exports.newReview = async (req, res) => {
  let listings = await Listing.findById(req.params.id);
  let reviews = new review({
    rating: req.body.rating,
    comment: req.body.comment,
  });
  reviews.author = req.user._id;
  await reviews.save();
  listings.reviews.push(reviews);
  let result = await listings.save();
  req.flash("sucess", "New Review added!");
  res.redirect("back");
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("sucess", " Review Deleted!");
  res.redirect("back");
};
