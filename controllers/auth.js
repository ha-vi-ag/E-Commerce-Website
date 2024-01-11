const Users = require("../models/users");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  Users.findById("659e79fdc1b3e2217cbf5c98")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        if (err) console.log(err);
        res.redirect("/");
      });
    })
    .catch(console.log);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
};
