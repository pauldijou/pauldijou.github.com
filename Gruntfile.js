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

  grunt.registerTask("default", [
    "build",
    "watch"
  ]);

  grunt.registerTask("build", [
    "copy:fontAwesome",
    "less",
    "uglify"
  ]);

  grunt.registerTask("dist", [
    "build",
    "less",
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
      fontAwesome: {
        files: [{
          expand: true,
          cwd: "<%= config.dir.components %>/font-awesome/fonts/",
          src: ["*"],
          dest: "<%= config.dir.fonts %>/vendors/fontawesome"
        }]
      }
    },

    uglify: {
      resources: {
        files { 'javascripts/main.min.js': ['<%= config.dir.resources.styles %>/*.js'] }
      }
    },

    watch: {
      less: {
        files: ["<%= config.dir.resources.styles %>/**/*.less"],
        tasks: ["less:resources", "less:dist"]
      },
      javascript: {
        files: ["<%= config.dir.resources.scripts %>/*.js"],
        tasks: ["uglify"]
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
