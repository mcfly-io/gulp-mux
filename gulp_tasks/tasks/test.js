'use strict';
var gulp = require('gulp');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();
var mocha = $.mocha;
var istanbul = $.istanbul;
var gutil = require('gulp-util');
var chalk = require('chalk');

var constants = require('../common/constants')();

gulp.task('mocha', 'Runs the mocha tests.', function() {
    return gulp.src(constants.mocha.libs)
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gutil.log(__dirname);
            gulp.src(constants.mocha.tests)
                .pipe(mocha({
                    reporter: 'spec',
                    globals: constants.mocha.globals,
                    timeout: constants.mocha.timeout
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'json', 'text', 'text-summary', 'cobertura']
                }));
        });
});

gulp.task('test', 'Runs all the tests.', function(done) {
    runSequence(
        'lint',
        'mocha',
        done
    );
});