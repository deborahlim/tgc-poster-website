// Use bookshelf instead of raw SQL queries to create the product
// Reason for using an ORM solution like Bookshelf are SQL syntax independence(works with all kinds of SQL databases) and security

// Setting up the database connection
const knex = require("knex")({
  client: "mysql",
  connection: {
    user: "deb",
    password: "lim",
    database: "poster_shop",
  },
});

const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
