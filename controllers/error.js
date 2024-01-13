exports.get404 = (req, res, next) => {
  res.render("404", {
    pageTitle: "Error",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (error, req, res, next) => {
  res.render("500", {
    pageTitle: "Error!",
    isAuthenticated: req.session.isLoggedIn,
  });
};
