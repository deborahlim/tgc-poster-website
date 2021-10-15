// Use bookshelf instead of raw SQL queries to create the product
// Reason for using an ORM solution like Bookshelf are SQL syntax independence(works with all kinds of SQL databases) and security

// Setting up the database connection
const knex = require("knex")({
  client: "mysql",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
});

const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
