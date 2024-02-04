// core modules
const path = require("path");
const cors = require("cors");

// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

// user defined modules
const adminRoutes = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");
const authRoutes = require("./Routes/auth");
const errorHandler = require("./controllers/error");
const Users = require("./models/users");

const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());

// some constant
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // note here we need to replace colons (:) from the file path
    // The issue is that ":" is not allowed in a Windows file name.
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// static serving files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// some constant
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

app.use(cors());

// some constants
// const csrfProtection = csrf();

// app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await Users.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorHandler.get404);

// error handling routes
app.use(errorHandler.get500);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("db connected");
    app.listen(5000, () => console.log("server started"));
  } catch (err) {
    console.log(err);
  }
}

startServer();
