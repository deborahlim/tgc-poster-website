const express = require("express");
const { bootstrapField, createPosterForm } = require("../forms");
const router = express.Router();

// #1 import in the Poster model
const { Poster } = require("../models");

router.get("/", async (req, res) => {
  // #2 - fetch all the posters (ie, SELECT * from posters)
  // Collections are ordered sets of models returned from the database
  // Model.collection([models], [options]) is a static helper to instantiate a new collection, sets the model it's called on as the collection's target model
  // collection.fetch fethes the default set of models for this collection from the database, resetting the collection when they arrive
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(), // #3 - convert collection to JSON
  });
});

router.get("/create", (req, res) => {
  const posterForm = createPosterForm();
  res.render("posters/create", {
    // convert the form to it's HTML equivalent, using the bootstrapField function to format it using Bootstrap styles
    form: posterForm.toHTML(bootstrapField),
  });
});

router.post("/create", (req, res) => {
  const posterForm = createPosterForm();
  posterForm.handle(req, {
    success: async (form) => {
      const poster = new Poster(form.data);
      //   poster.set("title", form.data.title);
      //   poster.set("cost", form.data.cost);
      //   poster.set("description", form.data.description);
      //   poster.set("date", form.data.date);
      //   poster.set("stock", form.data.stock);
      //   poster.set("height", form.data.height);
      //   poster.set("width", form.data.width);

      await poster.save();
      res.redirect("/poster");
    },
    error: async (form) => {
      res.render("posters/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router;
