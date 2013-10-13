(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("gardenhose", 
  ["test_helpers","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    function async(callback) {
      setTimeout(callback, 0);
    }

    __exports__['default'] = function(callback) {
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
  });
window.gardenhose = requireModule("gardenhose");
})(window);