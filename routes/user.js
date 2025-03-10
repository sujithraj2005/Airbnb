const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedUrl } = require("../middelware.js");
const usercontroller = require("../controllers/user.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("listings/signup.ejs");
  })
  .post(usercontroller.newUser);

router
  .route("/login")
  .get((req, res) => {
    res.render("listings/login.ejs");
  })
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.userLogin
  );

router.get("/logout", usercontroller.userLogout);
module.exports = router;
