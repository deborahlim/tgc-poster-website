const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const fileStore = require("session-file-store")(session);
const csrf = require("csurf");

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

// set up sessions
app.use(
  session({
    store: new fileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // we will not resave the session if there are no changes
    saveUninitialized: true, // if a client connects with no session, immediately create one
  })
);

app.use(flash());

// enable csrf
app.use(csrf());

// handle csrf error
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADESRFTOKEN") {
    req.flash("error_messaes", "The form has expired");
    res.redirect("back");
  } else {
    next();
  }
});

// share CSRF with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// Share the user date with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  console.log("RESPONSE = ", res.locals);
  next();
});

// landingRoutes object refers to the router object which we export out from the landing.js file
const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/poster");
const userRoutes = require("./routes/users");
const cloudinaryRoutes = require("./routes/cloudinary");
async function main() {
  // If a URL begins with a single forward slash then consult the routes registered in the landingRoutes object (which we import in from landingRoutes.js)
  app.use("/", landingRoutes);
  app.use("/poster", posterRoutes);
  app.use("/users", userRoutes);
  app.use("/cloudinary", cloudinaryRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
