const bookshelf = require("../bookshelf");
// A model is a JavaScript class that represents one table. An instance of the model represents one row in the table
// Initialise models
// Create new poster model and stores it in the Poster object
const Poster = bookshelf.model("Poster", {
  tableName: "posters",
});

module.exports = { Poster };
