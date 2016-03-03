var path = require('path');
var mkdirp = require('mkdirp');
var jpm_utils = require("jpm/lib/utils");
var jpm_xpi = require("jpm/lib/xpi");
var jpm_run = require("jpm/lib/run");
var jpm_test = require("jpm/lib/test");

if (!Promise) {
  var Promise = require("es6-promise").Promise;
}

var XPI_PATH = "./tmp/";

module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('jpm:xpi', "build firefox xpi", function() {
    var done = this.async();
    prepareJPMGruntTask().then(function (cfg) {
      return new Promise(function (resolve, reject) {
        mkdirp(cfg.dirs.xpi, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }).then(function () {
        return jpm_xpi(cfg.manifest, cfg.jpmOptions);
      });
    }).then(function(res) {
      grunt.log.ok("Generated XPI: ", res);
      done(true);
    }).catch(function(e) {
      grunt.log.error("Error during XPI build:", e);
      done(false);
    });
  });

  grunt.registerTask('jpm:run', "run firefox addon", function() {
    var done = this.async();
    prepareJPMGruntTask().then(function (cfg) {
      return jpm_run(cfg.manifest, cfg.jpmOptions);
    }).then(function() {
      done(true);
    }, function(e) {
      grunt.log.error("Error running Firefox:", e);
      done(false);
    });
  });

  grunt.registerTask('jpm:test', "test firefox addon", function() {
    var done = this.async();
    prepareJPMGruntTask().then(function (cfg) {
      return jpm_test(cfg.manifest, cfg.jpmOptions);
    }).then(function (results) {
      if (results.code !== 0) {
        done(false);
      }
      done(true);
    }, function(e) {
      grunt.log.error("Error running Firefox:", e);
      done(false);
    });
  });

  function jpm(jpm_cmd) {
    var jpm_env = {};

    try {
      jpm_env = prepareJPMGruntTask();
    } catch(e) {
      grunt.log.error("Error preparing JPM Grunt Task: " + e);
      return Promise.reject(e);
    }

    var dirs = jpm_env.dirs;

    //jpm_env.manifest is a Promise
    return jpm_env.manifest.then(function(manifest) {
      return jpm_task(manifest, {
        command: jpm_cmd,
      });
    });
  }

  function prepareJPMGruntTask() {
    var grunt_config = grunt.config(["jpm", "options"]);

    grunt.verbose.ok("Loading config", grunt_config);

    var dirs = {
      src: path.resolve(grunt_config["src"]),
      xpi: path.resolve(grunt_config["xpi"] || XPI_PATH)
    };
    var manifestPromise = jpm_utils.getManifest({addonDir:dirs.src});

    var jpmOptions = {
      addonDir: dirs.src,
      xpiPath: dirs.xpi,
      verbose: grunt.option('debug'),
      debug: grunt.option('firefox-debugger'),
      profile: grunt.option('firefox-profile') || process.env.FIREFOX_PROFILE,
      binary: grunt.option('firefox-bin') || process.env.FIREFOX_BIN
    };

    return manifestPromise.then(function (manifest) {
      return { manifest: manifest, dirs: dirs, jpmOptions: jpmOptions };
    });
  }
};
