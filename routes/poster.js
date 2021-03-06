const express = require("express");
const {
  bootstrapField,
  createPosterForm,
  createSearchForm,
} = require("../forms");
const router = express.Router();
const { checkIfAuthenticated } = require("../middlewares");
// #1 import in the Poster model
const { Poster, MediaProperty, Tag } = require("../models");
const dataLayer = require("../dal/posters");

// router.get("/", async (req, res) => {
//   // #2 - fetch all the posters (ie, SELECT * from posters)
//   // Collections are ordered sets of models returned from the database
//   // Model.collection([models], [options]) is a static helper to instantiate a new collection, sets the model it's called on as the collection's target model
//   // collection.fetch fethes the default set of models for this collection from the database, resetting the collection when they arrive
//   let posters = await Poster.collection().fetch({
//     // The withRelated key allows us to specify the name of the relationship on the model to load.
//     // In this case, we want to load the Property relationship.
//     // The name of the relationship is the name of the function that returns a relationship in the model
//     withRelated: ["mediaProperty", "tags"],
//   });
//   res.render("posters/index", {
//     posters: posters.toJSON(), // #3 - convert collection to JSON
//   });
// });

router.get("/", async (req, res) => {
  // 1. get all the media properties
  const allMediaProperties = await dataLayer.getMediaProperties();
  // console.log(allMediaProperties);
  // add --- to represent no categories chosen, [] as caolan form needs array of array format
  allMediaProperties.unshift([0, "----"]);

  const allTags = await dataLayer.getTags();
  // console.log(allTags);
  let searchForm = createSearchForm(allMediaProperties, allTags);
  // query builder that means SELECT * from posters. we can continue to add clauses to a query builder until we execute it with a fetch function call
  let q = await dataLayer.getAll();
  searchForm.handle(req, {
    empty: async (form) => {
      // when empty fetch and display all posters
      let posters = await q.fetch({
        withRelated: ["mediaProperty", "tags"],
      });
      console.log(posters.toJSON());
      res.render("posters/index", {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    error: async (form) => {
      // when empty fetch and display all posters
      let posters = await q.fetch({
        withRelated: ["mediaProperty", "tags"],
      });

      res.render("posters/index", {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    success: async (form) => {
      console.log(req.query);
      console.log(form.data);
      if (form.data.title) {
        q = q.where("title", "like", "%" + req.query.title + "%");
      }

      if (form.data.media_property_id && form.data.media_property_id !== "0") {
        q = q
          .query(
            "join",
            "media_properties",
            "media_property_id",
            "media_properties.id"
          )
          .where("media_properties.id", "=", req.query.media_property_id);
      }

      if (form.data.tags) {
        q = q
          .query("join", "posters_tags", "posters.id", "poster_id")
          .where("tag_id", "in", form.data.tags.split(","));
      }

      if (form.data.min_cost) {
        q = q.where("cost", ">=", form.data.min_cost);
      }
      if (form.data.max_cost) {
        q = q.where("cost", "<=", form.data.max_cost);
      }

      if (form.data.min_height) {
        q = q.where("height", ">=", form.data.min_height);
      }

      if (form.data.min_width) {
        q = q.where("width", ">=", form.data.min_width);
      }

      let posters = await q.fetch({
        withRelated: ["mediaProperty", "tags"],
      });
      res.render("posters/index", {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
  const allMediaProperties = await dataLayer.getMediaProperties();

  const allTags = await dataLayer.getTags();
  const posterForm = createPosterForm(allMediaProperties, allTags);
  console.log(
    process.env.CLOUDINARY_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_UPLOAD_PRESET
  );
  res.render("posters/create", {
    // convert the form to it's HTML equivalent, using the bootstrapField function to format it using Bootstrap styles
    form: posterForm.toHTML(bootstrapField),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

router.post("/create", checkIfAuthenticated, async (req, res) => {
  // 1. Read in all the Properties
  const allMediaProperties = await dataLayer.getMediaProperties();

  const allTags = await dataLayer.getTags();
  const posterForm = createPosterForm(allMediaProperties, allTags);
  posterForm.handle(req, {
    success: async (form) => {
      // separate out tags from the other product data
      // as not to cause an error when we create
      // the new product

      let { tags, ...posterData } = form.data;
      // 2. Save data from form into the new product instance
      // instead of manually setting each field, we pass all the data in the form to the product via the constructor
      // For this to work, the name of fields in the form must match the name of all columns in the table.
      const poster = new Poster(posterData);
      //   poster.set("title", form.data.title);
      //   poster.set("cost", form.data.cost);
      //   poster.set("description", form.data.description);
      //   poster.set("date", form.data.date);
      //   poster.set("stock", form.data.stock);
      //   poster.set("height", form.data.height);
      //   poster.set("width", form.data.width);

      await poster.save();
      // save the many to many relationship
      if (tags) {
        // attach id of selected tags to the product
        // caolan forms will return tags as "1, 2, 3"
        await poster.tags().attach(tags.split(","));
      }
      req.flash(
        "success_messages",
        `New Poster ${poster.get("title")} has been created`
      );
      res.redirect("/poster");
    },
    error: async (form) => {
      res.render("posters/create", {
        form: form.toHTML(bootstrapField),
      });
      res.flash("error_messages", "Error creating the poster");
    },
  });
});

router.get("/:poster_id/update", async (req, res) => {
  // retrieve the product
  const posterId = req.params.poster_id;
  const poster = await dataLayer.findPoster(posterId);
  const allMediaProperties = await dataLayer.getMediaProperties();

  const allTags = await dataLayer.getTags();

  const posterForm = createPosterForm(allMediaProperties, allTags);

  // set the form's field values to the same as the attributes of the product
  posterForm.fields.title.value = poster.get("title");
  posterForm.fields.cost.value = poster.get("cost");
  posterForm.fields.description.value = poster.get("description");
  posterForm.fields.date.value = poster.get("date");
  posterForm.fields.stock.value = poster.get("stock");
  posterForm.fields.height.value = poster.get("height");
  posterForm.fields.width.value = poster.get("width");
  posterForm.fields.media_property_id.value = poster.get("media_property_id");
  // fill in the multi-select for the tags
  let selectedTags = await poster.related("tags").pluck("id");
  posterForm.fields.tags.value = selectedTags;
  res.render("posters/update", {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
  });
});

router.post("/:poster_id/update", async (req, res) => {
  const posterId = req.params.poster_id;
  const poster = await dataLayer.findPoster(posterId);

  const posterForm = createPosterForm();

  posterForm.handle(req, {
    success: async (form) => {
      let { tags, ...posterData } = form.data;
      poster.set(posterData);
      poster.save();
      // Update the tags
      let selectedTagIds = tags.split(",").map((i) => Number(i));

      let existingTagIds = await poster.related("tags").pluck("id");

      // remove all the tags that are not selected anymore
      let toRemove = existingTagIds.filter((id) => {
        return selectedTagIds.includes(id) === false;
      });

      await poster.tags().detach(toRemove);

      // add in all the tags selected in the form
      await poster.tags().attach(selectedTagIds);
      res.redirect("/poster");
    },
    error: async (form) => {
      res.render("posters/update", {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON(),
      });
    },
  });
});

router.get("/:poster_id/delete", async (req, res) => {
  const posterId = req.params.poster_id;
  const poster = await dataLayer.findPoster(posterId);
  res.render("posters/delete", {
    poster: poster.toJSON(),
  });
});

router.post("/:poster_id/delete", async (req, res) => {
  const posterId = req.params.poster_id;
  const poster = await dataLayer.findPoster(posterId);
  await poster.destroy();
  res.redirect("/poster");
});

module.exports = router;
