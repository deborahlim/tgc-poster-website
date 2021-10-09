const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const fileStore = require("session-file-store")(session);

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
    secret: "keyboard cat",
    resave: false, // we will not resave the session if there are no changes
    saveUninitialized: true, // if a client connects with no session, immediately create one
  })
);

app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// landingRoutes object refers to the router object which we export out from the landing.js file
const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/poster");
const userRoutes = require("./routes/users");
async function main() {
  // If a URL begins with a single forward slash then consult the routes registered in the landingRoutes object (which we import in from landingRoutes.js)
  app.use("/", landingRoutes);
  app.use("/poster", posterRoutes);
  app.use("/users", userRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
