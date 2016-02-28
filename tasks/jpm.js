var path = require('path');
var mkdirp = require('mkdirp');
var getId = require('jetpack-id');
var fs = require('fs');
var jpm_utils = require("jpm/lib/utils");
var jpm_xpi = require("jpm/lib/xpi");
var jpm_sign = require("jpm/lib/sign").sign;
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

    var dirs = jpm_env.dirs;

    //jpm_env.manifest is a Promise
    jpm_env.manifest.then(function(result) {
      // Ensure dest xpi dir exists
      mkdirp(dirs.xpi, function(error) {
        if (error) {
          grunt.log.error("Error creating xpi dest dir: " + error);
          return;
        }

        jpm_xpi(result, {
          verbose: grunt.option('debug'),
          addonDir: dirs.src,
          xpiPath: dirs.xpi
        }).then(function(res) {
          grunt.log.ok("Generated XPI: ", res);
        }, function(e) {
          grunt.log.error("Error during XPI build:", e);
        }).then(function () {
          done(true);
        });
      });
    });
  });

  grunt.registerTask('jpm:sign', "sign or sign & create firefox xpi", function() {
    var jpm_env = {};

    try {
      jpm_env = prepareJPMGruntTask();
    } catch(e) {
      grunt.log.error("Error preparing JPM Grunt Task: " + e);
      return;
    }

    var done = this.async();

    var dirs = jpm_env.dirs;

    //jpm_env.manifest is a Promise
    jpm_env.manifest.then(function(manifest) {
      // Ensure dest xpi dir exists
      mkdirp(dirs.xpi, function(error) {
        if (error) {
          grunt.log.error("Error creating xpi dest dir: " + error);
          return;
        }

        //This is lifted from jpm's xpi.js, so we can support jpm:xpi -> jpm:sign or just jpm:sign
        var xpiVersion = manifest.version ? ("-" + manifest.version) : "";
        var xpiName = getId(manifest) + xpiVersion + '.xpi';
        var xpiDir = dirs.xpi;
        if (xpiDir[xpiDir.length - 1] !== '/') xpiDir += '/';

        var fullXPIPath = xpiDir + xpiName;
        var xpiPath = false;
        try {
          fs.accessSync(fullXPIPath);
          xpiPath = fullXPIPath;
        }
        catch(e){}

        jpm_sign({
          verbose: grunt.option('debug'),
          addonDir: dirs.src,
          xpiPath: dirs.xpi,
          xpi: xpiPath,
          apiKey: dirs.apiKey,
          apiSecret: dirs.apiSecret,
          timeout: dirs.timeout
        }).then(function(res) {
          grunt.log.ok("Signed XPI: ", res);
        }, function(e) {
          grunt.log.error("Error while signing xpi:", e);
        }).then(function () {
          done(true);
        });
      });
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
      addonDir: dirs.src,
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
    var manifest = jpm_utils.getManifest({addonDir:dirs.src});

    return { manifest: manifest, dirs: dirs };
  }
};

function resolveDirsFromConfig(grunt_config, name) {
  return {
    src: path.resolve(grunt_config["src"]),
    xpi: path.resolve(grunt_config["xpi"] || XPI_PATH),
    apiKey: grunt_config.apiKey,
    apiSecret: grunt_config.apiSecret,
    timeout: grunt_config.timeout
  };
}
