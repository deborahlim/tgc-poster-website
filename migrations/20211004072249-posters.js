'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};
// migration files allow us to create tabled in the database without having to use SQL code itself. Allows us to track changes to the database in git, and lets us use different database technologies seamlessly
exports.up = function(db) {
  // An unsigned integer is a 32-bit datum that encodes a nonnegative integer in the range [0 to 4294967295]. 
  return db.createTable('posters', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, notNull: true, unsigned: true, length: 10},
     title: {type: 'string', length: 100, notNull: true},
     cost: 'real',
     description: {type:"text", length: 1000, notNull: true },
     date: "date",
     stock: "int",
     height: "real",
     width: "real",
  })
};

exports.down = function(db) {
  return db.dropTable('posters');
};

exports._meta = {
  "version": 1
};
