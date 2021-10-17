const bookshelf = require("../bookshelf");
// A model is a JavaScript class that represents one table. An instance of the model represents one row in the table
// Initialise models
// Create new poster model and stores it in the Poster object
const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  mediaProperty() {
    // argument is the name of the model
    // the Poster model belongs to one MediaProperty Model
    return this.belongsTo("MediaProperty");
  },
  tags() {
    return this.belongsToMany("Tag");
  },
});

const MediaProperty = bookshelf.model("MediaProperty", {
  tableName: "media_properties",
  poster() {
    return this.hasMany("Poster");
  },
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  posters() {
    return belongsToMany("Poster");
  },
});

const User = bookshelf.model("User", {
  tableName: "users",
});

const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  poster() {
    return this.belongsTo("Poster");
  },
  user() {
    return this.belongsTo("User");
  },
});

module.exports = { Poster, MediaProperty, Tag, User, CartItem };
