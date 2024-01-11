const path = require("path");
// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);

// user defined modules
const adminRoutes = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");
const authRoutes = require("./Routes/auth");

const Users = require("./models/users");
const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// static serving files
app.use(express.static(path.join(__dirname, "public")));

const MONGODB_URI =
  "mongodb+srv://ha_vi_ag:5XXCXkW7N6S4Efq5@cluster0.ifwhghb.mongodb.net/ecart?retryWrites=true&w=majority";

const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "The author name is Harshit",
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: "destroy",
  })
);

app.use((req, res, next) => {
  if (!req.session.user) return next();
  Users.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.log);
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", (req, res, next) => {
  res.render("404", {
    pageTitle: "Error",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("db connected");
    Users.findOne().then((user) => {
      if (!user) {
        user = new Users({
          name: "Harshit",
          email: "ha635987@gmail.com",
          cart: {
            items: [],
          },
        });
        return user.save();
      }
    });
    app.listen(3000, () => console.log("server started"));
  })
  .catch(console.log);
