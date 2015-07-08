var child_process = require('child_process');
var async = require('async');

module.exports = function(options) {
  if (!options.db) {
    throw new Error('The `db` is required in the `options`.');
  }

  var run = function(scripts, next) {
    if (!(scripts instanceof Array)) {
      throw new Error('The scripts to run must be given in an Array.');
    }

    async.eachSeries(scripts, function(file, callback) {
      var connection = 'mongo ' + options.db + ' ' + file;

      child_process.exec(connection, function(err, stdout, stderr) {
        if (err || stderr) {
          var error = err.code
            ? 'Update.js child process failed with error code: ' + err.code
            : '';

          error = stderr
            ? error + '\n' + 'STDERR: ' + stderr
            : error;

          return callback(new Error(error));
        }

        callback();
      });
    }, function(err) {
      if (err) {
        throw err;
      }

      next();
    });
  };

  return {
    run: run
  };
};
