import "test_helpers";

function async(callback) {
  setTimeout(callback, 0);
}

export default = function(callback) {
  var nexts = [], errors = [], completes = [];

  this.subscribe = function(next, error, complete) {
    if (next) nexts.push(next);
    if (error) errors.push(error);
    if (complete) completes.push(complete);
  };

  callback(next, error, complete);

  function next(value) {
    async(function() {
      nexts.forEach(function(callback) {
        callback(value);
      });
    });
  }

  function error(reason) {
    async(function() {
      errors.forEach(function(callback) {
        callback(reason);
      });
    });
  }

  function complete() {
    async(function() {
      completes.forEach(function(callback) {
        callback();
      });
    });
  }
}
