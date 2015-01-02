/*
 * grunt-module-index
 *
 * Copyright (c) 2014 Ignacio Lago
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      },
    },
    jsbeautifier: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        config: '.jsbeautifyrc'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  // By default, lint and build.
  grunt.registerTask('default', ['jshint', 'jsbeautifier', 'jshint']);
};
