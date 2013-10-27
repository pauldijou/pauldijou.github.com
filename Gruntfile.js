"use strict";

var path = require("path");

var renamedTasks = {

};

module.exports = function (grunt) {
  var bower = require("bower");

  require("matchdep").filterDev("grunt-*").forEach(function (plugin) {
    grunt.loadNpmTasks(plugin);
    if (renamedTasks[plugin]) {
      grunt.renameTask(renamedTasks[plugin].original, renamedTasks[plugin].renamed);
    }
  });

  var configuration = {
    pkg : grunt.file.readJSON("package.json"),
    dir: {
      resources: {
        root: "_resources",
        styles: "<%= config.dir.resources.root %>/stylesheets",
        scripts: "<%= config.dir.resources.root %>/javascripts"
      },
      styles: "stylesheets",
      scripts: "javascripts",
      fonts: "<%= config.dir.styles %>/fonts",
      components: "bower_components",
      blog: "blog",
      projects: "projects"
    }
  };

  grunt.registerTask("bowerCopy", [
    "copy:bowerNormalize",
    "copy:bowerJQuery",
    "copy:bowerFontAwesome",
    "copy:bowerModernizr",
    "copy:bowerLodash"
  ]);

  grunt.registerTask("default", [
    "build",
    "watch"
  ]);

  grunt.registerTask("build", [
    "bowerCopy",
    "less:resources"
  ]);

  grunt.registerTask("dist", [
    "build",
    "less:dist",
    "copy:dist"
  ]);

  grunt.registerTask("test", [
    "build",
    "karma:test"
  ]);

  grunt.initConfig({
    config: configuration,

    clean: {
      dist: {}
    },

    less: {
      options: {
        paths: ["<%= config.dir.components %>", "<%= config.dir.resources.styles %>"]
      },
      resources: {
        files: [{
          "<%= config.dir.styles %>/main.css": ["<%= config.dir.resources.styles %>/main.less"]
        }]
      },
      dist: {
        options: {
          compress: true,
          yuicompress: true
        },
        files: [{
          "<%= config.dir.styles %>/main.min.css": ["<%= config.dir.resources.styles %>/main.less"]
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.resources.fonts %>",
          src: ["**"],
          dest: "<%= config.dir.fonts %>"
        }]
      },
      // Here start the Bower hell: manual copying of all required resources installed with Bower
      // Prefix them all with "bower"
      // Be sure to add them to the "bowerCopy" task near the top of the file
      bowerNormalize: {
        files: {
          "<%= config.dir.resources.styles %>/vendors/normalize/normalize.less": "<%= config.dir.components %>/normalize-css/normalize.css"
        }
      },
      bowerJQuery: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components %>/jquery/",
          src: ["*.js"],
          dest: "<%= config.dir.scripts %>/vendors/jquery/"
        }]
      },
      bowerFontAwesome: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components %>/font-awesome/fonts/",
          src: ["*"],
          dest: "<%= config.dir.fonts %>/vendors/fontawesome"
        }]
      },
      bowerModernizr: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components %>/modernizr/",
          src: ["modernizr.js"],
          dest: "<%= config.dir.scripts %>/vendors/modernizr/"
        }]
      },
      bowerLodash: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components %>/lodash/dist/",
          src: ["lodash.js", "lodash.min.js"],
          dest: "<%= config.dir.scripts %>/vendors/lodash/"
        }]
      }
    },

    uglify: {
      dist: {
        options: {
          compress: true
        },
        files: [{
          "<%= config.dir.scripts %>main.min.js": [
            "<%= config.dir.scripts %>/vendors/jquery/jquery.js",
            "<%= config.dir.scripts %>/vendors/lodash/lodash.js",
            "<%= config.dir.scripts %>/prettify.js",
            "<%= config.dir.scripts %>/slides.js",
            "<%= config.dir.scripts %>/main.js"
          ]
        }]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      less: {
        files: ["<%= config.dir.resources.styles %>/**/*.less"],
        tasks: ["less:resources"]
      },
      dist: {
        files: [
          "_site/**/*"
        ],
        tasks: []
      }
    }
  });

};