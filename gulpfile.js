'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');

var packageName = require('./package.json').name;

gulp.task('lint', function() {
  return gulp.src(['./addon/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('package', function () {
    return gulp.src('addon/*')
        .pipe(zip('package.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'package']);
