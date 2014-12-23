# gulp-mux 
[![NPM Version][npm-image]][npm-url] [![Downloads](http://img.shields.io/npm/dm/gulp-mux.svg)](http://badge.fury.io/js/gulp-mux)   
[![Build Status](https://travis-ci.org/thaiat/gulp-mux.svg?branch=master)](https://travis-ci.org/thaiat/gulp-mux) [![Test Coverage](https://codeclimate.com/github/thaiat/gulp-mux/badges/coverage.svg)](https://codeclimate.com/github/thaiat/gulp-mux) [![Code Climate](https://codeclimate.com/github/thaiat/gulp-mux/badges/gpa.svg)](https://codeclimate.com/github/thaiat/gulp-mux)   
[![Dependency Status](https://david-dm.org/thaiat/gulp-mux.svg)](https://david-dm.org/thaiat/gulp-mux) [![devDependency Status](https://david-dm.org/thaiat/gulp-mux/dev-status.svg)](https://david-dm.org/thaiat/gulp-mux#info=devDependencies) [![peerDependency Status](https://david-dm.org/thaiat/gulp-mux/peer-status.svg)](https://david-dm.org/thaiat/gulp-mux#info=peerDependencies)    


Gulp-mux is a utility for registering and running tasks using gulp based on simple javascript functions requiring dynamically generated parameters. It was written for using gulp with `generator-angular-famous-ionic` but is useful in any project that employs gulp to manage several distribution targets or sub-apps. 

It is provided with a submodule to allow the user to specify which targets they want to use from the command line 


[![NPM](https://nodei.co/npm/gulp-mux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mux)

## Usage
(using a `--target <targetName>` flag following the gulp tasks). 


## Testing
To run unit test for the yeoman project use the following command:
```
gulp test
```

If you just want to run mocha and are not interested yet in linting your files you can run:
```
gulp mocha
```

If you just want to run some specific unit test use:
```
mocha test/app.test.js -r test/helpers/globals.js
```
This will tell mocha to run only the tests located in `test/app.test.js` (The -r option is necessary here to add global configuration file for mocha, when using gulp the `globals.js` is added automatically)


## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/thaiat/gulp-mux/releases)

## License

[npm-image]: https://badge.fury.io/js/gulp-mux.svg
[npm-url]: https://badge.fury.io/js/gulp-mux

