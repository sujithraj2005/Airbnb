const Listing = require("../modles/listing.js");
const review = require("../modles/reviews.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: MapToken });

module.exports.index = async (req, res) => {
  let listing = await Listing.find();
  res.render("listings/index.ejs", { listing });
};

module.exports.renderCreate = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postCreate = async (req, res, next) => {
  let geocodingCordinates = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let { path, filename } = req.file;
  let newList = new Listing(req.body.listing);
  newList.owner = req.user;
  newList.image = { url: path, filename };
  newList.geometry = geocodingCordinates.body.features[0].geometry;
  await newList.save();
  req.flash("sucess", "New Lisiting added!");
  res.redirect("/listings");
};

module.exports.renderShow = async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner")
    .exec();

  if (!data) {
    req.flash("error", "Listing you requested does not exist!!");
    res.redirect("/listings");
  }
  res.render("listings/showData.ejs", { data });
};

module.exports.renderUpdate = async (req, res) => {
  let id = req.params.id;
  let prevData = await Listing.findById(id);
  if (!prevData) {
    req.flash("error", "Listing you requested does not exist!!");
    res.redirect("/listings");
  }
  let originalUrl = prevData.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { prevData, originalUrl });
};

module.exports.putUpdate = async (req, res) => {
  let id = req.params.id;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let { path, filename } = req.file;
    updatedListing.image = { url: path, filename };
    updatedListing.save();
  }
  req.flash("sucess", " Lisiting Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destorListing = async (req, res) => {
  let id = req.params.id;
  let lis = await Listing.findById(id);
  let ids = lis.reviews;
  let r = await review.deleteMany({ _id: ids });
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("sucess", " Lisiting Deleted!");
  res.redirect("/listings");
};
