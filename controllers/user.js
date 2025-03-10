const user = require("../modles/user.js");
module.exports.newUser = async (req, res) => {
  try {
    let { username, email, password } = req.body.user;
    const newUser = new user({ username, email });
    const registeredUser = await user.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("sucess", "Welcome to WonderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("back");
  }
};

module.exports.userLogin = async (req, res) => {
  if (res.locals.savedUrl) {
    req.flash("sucess", "Welcome to Wonderlust!");
    res.redirect(res.locals.savedUrl);
  } else res.redirect("/listings");
};

module.exports.userLogout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("sucess", "sucessfully logged out");
    res.redirect("/listings");
  });
};
