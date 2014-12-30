# gulp-mux 
[![NPM Version][npm-image]][npm-url] [![Downloads](http://img.shields.io/npm/dm/gulp-mux.svg)](http://badge.fury.io/js/gulp-mux)   
[![Build Status](https://travis-ci.org/thaiat/gulp-mux.svg?branch=master)](https://travis-ci.org/thaiat/gulp-mux) [![Test Coverage](https://codeclimate.com/github/thaiat/gulp-mux/badges/coverage.svg)](https://codeclimate.com/github/thaiat/gulp-mux) [![Code Climate](https://codeclimate.com/github/thaiat/gulp-mux/badges/gpa.svg)](https://codeclimate.com/github/thaiat/gulp-mux)   
[![Dependency Status](https://david-dm.org/thaiat/gulp-mux.svg)](https://david-dm.org/thaiat/gulp-mux) [![devDependency Status](https://david-dm.org/thaiat/gulp-mux/dev-status.svg)](https://david-dm.org/thaiat/gulp-mux#info=devDependencies) [![peerDependency Status](https://david-dm.org/thaiat/gulp-mux/peer-status.svg)](https://david-dm.org/thaiat/gulp-mux#info=peerDependencies)    


Gulp-mux is a utility for registering and running tasks using gulp based on simple javascript functions requiring dynamically generated parameters. It was written for using gulp with `generator-angular-famous-ionic` but is useful in any project that employs gulp to manage several distribution targets or sub-apps. It contains a submodule to allow the user to specify which targets they want to use when running a given task from the command line, as well as the mode they want to use when running it, i.e. `dev` or `prod`.


[![NPM](https://nodei.co/npm/gulp-mux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mux)

## Usage
Require the module from your gulpfile using
```node
var gmux = require('gulp-mux');
```

### Motivation
In general this tool allows the user to run gulp tasks for files with different flags as suffixes in their filenames, indicating that there are multiple client-side sub-apps built in the same project tree. A single project may have a mobile app to be compiled with cordova, a web app that isn't, and others such as an interactive API visualizer. All of them talk to the same back-end and they often require similar front-end code, so building them side-by-side in the same client folder can leverage pre-existing folder structure and keep your code reuse high. The downside to this approach is that standard taskrunners like gulp, as well as many of the common tasks they use like style, browserify, or browsersync will not know the difference between the various apps if they are in the same place. `gulp-mux` was written to handle these cases by instr...

### How it works
`gulp-mux` inspects the root level of your client folder for a number of files that match `index*.html`. It makes the assumption that each of the user's intended sub-apps has its own `index-<sub-app-name>.html` in that location. Thus a project with `mobile`, `web`, and `apitool` sub-apps is expected to have a client folder that looks like this:

```sh
client
├── ...
├── index-apitool.html
├── index-mobile.html
├── index-web.html
├── index.html
└── ...
```
*NB: This is part of  what is scaffolded by `yo angular-famous-ionic:target`*

Once `gulp-mux` has inspected the...

### Example Setup

Follow these steps rto set up a simple `copy` task that uses `gulp-mux`:
**PLACEHOLDER FOR TUTORIAL**

## API
*The following assumes you required the module as decribed in the Usage section.*

### `gmux.targets` Methods
#### `setClientFolder(path)`
> *Set the client folder where the available targets live.*

This function tells `gulp-mux` which folder contains `index*.html` files that define which targets are available. If a client folder is not provided, the module will assume that the client folder is called `client` and is located in the root directory of your project.

#### `getAllTargets()`
> *Inspect the client folder set with `setClientFolder` for files with a name that matches `index-<target>.html`. An array of `<target>` names is returned.*

This function returns an array containing a list of all of the avaialable target names found in the client folder that you specified.

#### `askForMultipleTargets(taskname)`
> *Create and return the yargs object containing the multiple targets provided on the command line with -t and the mode if provided with -m.*

Instructions for `askForMultipleTargets`


#### `askForSingleTarget(taskname)`
>*Create and return the yargs object containing the single target provided on the command line with -t and the mode if provided with -m.*

Instructions for `askForSingleTarget`

### `gmux` Methods
#### `resolveConstants(constants, templateObj)`
> *Resolve the passed constants object with the target*

Instructions for `resolveConstants`

#### `createAndRunTasks(gulp, fn, taskname, targets, mode, constants, cb)`
> *Composes the `createTask` and `runTask` functions*

Instructions for `createAndRunTasks`


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

