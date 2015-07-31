# grunt-jpm v.0.1.2

> Run and build Firefox Addon using JPM from your Gruntfile.js

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jpm --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jpm');
```

### Settings

This plugin is configured using the "jpm.options" section of your *Gruntfile.js* config:

```js
grunt.initConfig({
  ...
  jpm: {
    options: {
      src: "./src/",
      xpi: "./tmp/"
    }
});
```

#### src
Type: `String`

This defines the relative path to the add-on sources.

#### xpi
Type: `String`

This defines the relative path to the directory where the built xpi will be written.

## *jpm:xpi* task
_Run this task with the `grunt jpm:xpi` command to build an xpi from your addon sources._

- use the **--verbose** and *-d* command line option to run the tasks verbosely

## *jpm:run* task
_Run this task with the `grunt jpm:run` command to build an xpi from your addon sources._

Optionally you can:

- define the *FIREFOX_BIN* environment var or use the *--firefox-bin* command line option
  to specify the absolute path to the Firefox binary
- define the *FIREFOX_PROFILE* environment var or use the *--firefox-profile* command line option
  to specify the absolute path to a Firefox profile
- use the **--firefox-debugger** command line option to automatically start the Firefox Developer Toolbox connected to the add-on
- use the **--verbose** and *-d* command line option to run the tasks verbosely

## Release History

- 0.1.2 - update jpm to the latest version (1.0.0)
- 0.1.1 - relese fix #3 "invoke done for successful jpm runs"
- 0.1.0 - initial release
