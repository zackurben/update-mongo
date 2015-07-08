'use strict';

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

// Include update-mongo and use the provided test database.
var updates = require('../lib/index')({db: 'test'});

var db = null;
var test = null;
describe('Update-Mongo test suite.', function() {

  it('Should be able to connect to mongo', function(done) {
    MongoClient.connect('mongodb://localhost:27017/test', function(err, connection) {
      if (err) {
        throw err;
      }

      connection.open(function(err, database) {
        if (err) {
          throw err;
        }

        db = database;
        done();
      });
    });
  });

  it('Should be able to run the Mongo update scripts', function(done) {
    // Run the provided update scripts in order, than invoke our callback.
    updates.run([
      './test/update1.js',
      './test/update2.js'
    ], function() {
      done();
    });
  });

  it('Should be able to connect to the test Collection', function(done) {
    db.collection('test', function(err, collection) {
      if (err) {
        throw err;
      }

      test = collection;
      done();
    });
  });

  it('Should be able to see the changes from the Mongo update scripts', function(done) {
    test.findOne({foo: 'bar'}, function(err, document) {
      if (err) {
        throw err;
      }

      assert.notEqual(document, null);
      assert.equal(document.foo, 'bar');

      done();
    });
  });
});
