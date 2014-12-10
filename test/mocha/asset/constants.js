'use strict';

var path = require('path');

// externally required parameters
var cwd = process.env.INIT_CWD || '';
var clientFolder = 'www';
var BASE_TARGET_NAME = 'app';

// static (untemplated) parameters
module.exports = {
    cwd: cwd,

    clientFolder: clientFolder,

    BASE_TARGET_NAME: BASE_TARGET_NAME,

    repository: 'https://github.com/jskrzypek/gulpTargetFlag',

    versionFiles: ['./package.json', './bower.json', './config.xml'],

    growly: {
        notify: false,
        successIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/success.png'),
        failedIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/failed.png')
    },

    mocha: {
        libs: ['server/**/*.js'],
        tests: ['test/mocha/**/*.js'],
        globals: 'test/mocha/helpers/globals.js',
        timeout: 5000
    },

    lint: ['./' + clientFolder + '/**/*.js', '!./' + clientFolder + '/**/*-*.js', './' + clientFolder + '/**/*${ target }.js', './server/**/*.js', 'gulpfile.js', 'gulp_tasks/**/*.js', 'karam.conf.js', 'test/**/*.js', '!test/**/*-*.js', 'test/**/*${ target }.js', '!./' + clientFolder + '/scripts/bundle*.js', '!./' + clientFolder + '/scripts/bundle*.min.js'],

    fonts: {
        src: ['./bower_components/ionic/release/fonts/*.*'],
        dest: './' + clientFolder + '/fonts'
    },

    style: {
        src: ['./' + clientFolder + '/styles/**/*.css', '!./' + clientFolder + '/styles/**/*-*.css', './' + clientFolder + '/styles/**/*${ target }.css', './' + clientFolder + '/styles/**/*.scss', '!./' + clientFolder + '/styles/**/*-*.scss', './' + clientFolder + '/styles/**/*${ target }.scss', '!./' + clientFolder + '/styles/main*.css', '!./' + clientFolder + '/styles/main*.min.css'],
        dest: './' + clientFolder + '/styles',
        destName: 'main${ target }.css',
        sass: {
            src: ['./' + clientFolder + '/styles/main${ target }.scss']
        },
        css: {
            src: ['./bower_components/famous-angular/dist/famous-angular.css']
        }
    },

    browserify: {
        src: ['./' + clientFolder + '/scripts/**/main.js', './' + clientFolder + '/scripts/**/main${ target }.js'],
        dest: './' + clientFolder + '/scripts',
        bundleName: 'bundle${ target }.js'
    },

    serve: {
        root: clientFolder,
        host: '0.0.0.0',
        livereload: 9000,
        port: 9500,
        localtunnel: true, // true, false or 'gulp-target-flag'
        files: {
            index: '/index${ target }.html',
            bundle: '/scripts/bundle${ target }.js',
            style: '/styles/main${ target }.css'
        }
    }
};