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

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Email does not exists" });
    }
    const status = await bcrypt.compare(password, user.password);
    if (status == false) {
      return res.status(400).json({
        error: "Wrong password",
      });
    }
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          error: "Something error happened",
        });
      }
      return res.status(200).json({
        message: "Successful logged In"
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: "Something error happened",
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Something error happened",
      });
    }
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

exports.postSignup = async (req, res, next) => {
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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Users({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    return res.status(500).json({
      error: "Something error happened",
    });
  }
};
