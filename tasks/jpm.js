var path = require('path');
var jpm_utils = require("jpm/lib/utils");
var jpm_xpi = require("jpm/lib/xpi");
var jpm_run = require("jpm/lib/run");

const XPI_PATH = "./tmp/";

module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('jpm:xpi', "build firefox xpi", function() {
    var jpm_env = {};

    try {
      jpm_env = prepareJPMGruntTask();
    } catch(e) {
      grunt.log.error("Error preparing JPM Grunt Task: " + e);
      return;
    }

    var done = this.async();

    var manifest = jpm_env.manifest;
    var dirs = jpm_env.dirs;

    jpm_xpi(manifest, {
      verbose: grunt.option('debug'),
      xpiPath: dirs.xpi
    }).then(function(res) {
      grunt.log.ok("Generated XPI: ", res);
    }, function(e) {
      grunt.log.error("Error during XPI build:", e);
    }).then(function () {
      process.chdir(dirs.old);
      done();
    });
  });

  grunt.registerTask('jpm:run', "run firefox addon", function() {
    var jpm_env = {};

    try {
      jpm_env = prepareJPMGruntTask();
    } catch(e) {
      grunt.log.error("Error preparing JPM Grunt Task: " + e);
      return;
    }

    var done = this.async();

    var manifest = jpm_env.manifest;
    var dirs = jpm_env.dirs;

    jpm_run(jpm_env.manifest, {
      verbose: grunt.option('debug'),
      debug: grunt.option('firefox-debugger'),
      profile: grunt.option('firefox-profile') || process.env.FIREFOX_PROFILE,
      binary: grunt.option('firefox-bin') || process.env.FIREFOX_BIN
    }).then(done, function(e) {
      grunt.log.error("Error running Firefox:", e);
    });
  });

  function prepareJPMGruntTask() {
    var grunt_config = grunt.config(["jpm", "options"]);

    grunt.verbose.ok("Loading config", grunt_config);

    var dirs = resolveDirsFromConfig(grunt_config);

    grunt.verbose.ok('Moving from directory: ' + process.cwd());
    grunt.verbose.ok('Moving to directory: ' + dirs.src);

    process.chdir(path.join(dirs.old, dirs.src));
    grunt.verbose.ok('New directory: ' + process.cwd());

    var manifest = jpm_utils.getManifest();

    return { manifest: manifest, dirs: dirs };
  }
};

function resolveDirsFromConfig(grunt_config, name) {
  var old_dir = process.cwd();

  return {
    old: old_dir,
    src: grunt_config["src"],
    xpi: path.join(old_dir, grunt_config["xpi"] || XPI_PATH)
  };
}
