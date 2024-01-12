const Users = require("../models/users");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let msg = req.flash("error");
  msg = msg.length > 0 ? msg[0] : null;
  res.render("auth/login", {
    pageTitle: "Login",
    error: msg,
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Users.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((status) => {
          if (status == false) {
            req.flash("error", "wrong password");
            return res.redirect("/login");
          }
          req.session.user = user;
          req.session.isLoggedIn = true;
          req.session.save((err) => {
            if (err) console.log(err);
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
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

exports.getSignup = (req, res, next) => {
  let msg = req.flash("error");
  msg = msg.length > 0 ? msg[0] : null;
  res.render("auth/signup", {
    pageTitle: "Signup",
    error: msg,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  Users.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "email already exists");
        return res.redirect("/signup");
      }

      if (password !== confirmPassword) {
        req.flash("error", "confirm password doesn't match");
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          user = new Users({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          user
            .save()
            .then(() => {
              res.redirect("/login");
            })
            .catch(console.log);
        })
        .catch(console.log);
    })
    .catch(console.log);
};
