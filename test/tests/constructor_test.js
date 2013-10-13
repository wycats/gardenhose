import Stream from "gardenhose";

module("The Stream constructor");

test("A stream can emit values", function() {
  var stream = new Stream(function(next, error, complete) {
    next(1);
    next(2);
    complete();
  });

  shouldEmit(stream, [1,2]);
});

test("A stream can emit an error", function() {
  var stream = new Stream(function(next, error) {
    error("reason");
  });

  shouldError(stream, "reason");
});

test("Extracted next and complete can be used", function() {
  var next, error, complete;

  var stream = new Stream(function(n, e, c) {
    next = n;
    error = e;
    complete = c;
  });

  shouldEmit(stream, [1,2,3]);

  next(1);
  next(2);
  next(3);
  complete();
});

test("Extracted error can be used", function() {
  var next, error, complete;

  var stream = new Stream(function(n, e, c) {
    next = n;
    error = e;
    complete = c;
  });

  shouldError(stream, "reason");

  error("reason");
});

function shouldEmit(stream, array) {
  stop();

  var count = 0;

  stream.subscribe(function(value) {
    var expected = array[count++];

    equal(expected, value);
  }, function() {
    ok(false, "Should not error");
  }, function() {
    equal(count, array.length);
    start();
  });
}

function shouldError(stream, expected) {
  stop();

  stream.subscribe(function() {
    ok(false, "Should not error");
  }, function(reason) {
    equal(reason, expected);
    start();
  }, function() {
    ok(false, "Should not error");
  });
}
