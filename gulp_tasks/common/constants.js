'use strict';

module.exports = function() {
    var cwd = process.env.INIT_CWD || '';

    var constants = {
        cwd: cwd,

        repository: 'https://github.com/thaiat/gulp-mux',
        versionFiles: ['./package.json', './bower.json'],

        lint: ['./lib/**/*.js', './index.js', 'gulpfile.js', 'gulp_tasks/**/*.js', 'test/**/*.js'],

        mocha: {
            libs: ['lib/**/*.js', 'index.js'],
            tests: ['test/mocha/**/*.js'],
            globals: 'test/mocha/helpers/globals.js',
            timeout: 5000
        },
        dist: {
            distFolder: 'dist'
        }
    };

    return constants;
};