const path = require("path");
// third party packages
const express = require("express");
const bodyParser = require("body-parser");

// user defined modules
const adminRoutes = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");

const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// static serving files
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  res.render("404", { pageTitle: "Error" });
});

app.listen(3000, () => console.log("server started"));
