'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Watch for changes and trigger compass, jshint, uglify and livereload
    watch: {
      compass: {
        files: ['sass/{,**/}*.scss'],
        tasks: ['compass:dev']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'stylesheets/style.css'
        ]
      }
    },

    // Compass and scss
    compass: {
      options: {
        bundleExec: true,
        httpPath: '/',
        cssDir: 'css',
        sassDir: 'sass',
        imagesDir: 'images',
        javascriptsDir: 'js',
        fontsDir: 'css/fonts',
        assetCacheBuster: 'none',
        require: [
          'sass-globbing'
        ]
      },
      dev: {
        options: {
          environment: 'development',
          outputStyle: 'expanded',
          relativeAssets: true,
          raw: 'line_numbers = :true\n'
        }
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compact',
          force: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'compass:dev',
    'watch'
  ]);
};
