const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const user = require("./modles/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRouter = require("./routes/user.js");
const password = encodeURIComponent("#Kunal8@");
const uri = `mongodb+srv://kunalwaldia81:${password}@cluster0.f1xsf4c.mongodb.net/`;
// const uri = process.env.uri;
var methodOverride = require("method-override");
engine = require("ejs-mate");

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(uri);
}

let store = MongoStore.create({
  crypto: {
    secret: "mysecretecode",
  },
  mongoUrl: uri,
  ttl: 14 * 24 * 60 * 60,
});

let sessionOptions = {
  store,
  secret: "mysecretecode",
  resave: false,
  saveUninitialized: true,
  cookies: {
    expiry: Date.now + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.err = req.flash("error");
  res.locals.user = req.user;

  next();
});

app.listen("8080", () => {
  console.log("listening port 8080");
});
app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
//to accept all requestion of domain
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found!!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  console.log(err);
  res.status(status).render("listings/Error.ejs", { message });
});
