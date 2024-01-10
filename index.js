const path = require("path");
// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// user defined modules
const adminRoutes = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");
const Users = require("./models/users");
const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// static serving files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  Users.findById("659e79fdc1b3e2217cbf5c98")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.log);
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  res.render("404", { pageTitle: "Error" });
});

mongoose
  .connect(
    "mongodb+srv://ha_vi_ag:5XXCXkW7N6S4Efq5@cluster0.ifwhghb.mongodb.net/ecart?retryWrites=true&w=majority"
  )
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
