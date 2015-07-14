'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

var packageName = require('./package.json').name;

gulp.task('lint', function() {
  return gulp.src(['./addon/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint']);
