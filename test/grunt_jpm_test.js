'use strict';

var grunt = require('grunt');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.grunt_jpm = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  jpm_xpi: function (test) {
    test.expect(1);

    var xpi_build = path.resolve("tmp", "dist", "test-addon@alcacoop.it-1.0.0.xpi");
    test.ok(grunt.file.exists(xpi_build), "xpi file should be built into 'tmp/dist'");

    test.done();
  },
  jpm_test: function(test) {
    test.expect(1);

    var test_result_file = path.resolve("tmp", "test_run.txt");
    test.ok(grunt.file.exists(test_result_file), "grunt jpm:test should run addon unit tests");
    test.done();
  }
};
