const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

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

// landingRoutes object refers to the router object which we export out from the landing.js file
const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/poster");
async function main() {
  // If a URL begins with a single forward slash then consult the routes registered in the landingRoutes object (which we import in from landingRoutes.js)
  app.use("/", landingRoutes);
  app.use("/poster", posterRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
