const Users = require("../models/users");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    error: null,
    oldInputs: {
      email: "",
      password: "",
    },
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Users.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          pageTitle: "Login",
          error: "Invalid Email",
          oldInputs: {
            email: email,
            password: password,
          },
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((status) => {
          if (status == false) {
            return res.render("auth/login", {
              pageTitle: "Login",
              error: "Wrong Password",
              oldInputs: {
                email: email,
                password: password,
              },
            });
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
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
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
  res.render("auth/signup", {
    pageTitle: "Signup",
    error: null,
    oldInputs: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      error: errors.array()[0].msg,
      oldInputs: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new Users({
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
    .catch((err) => {
      const error = new Error(err);
      next(error);
    });
};
