# gulp-mux 
[![NPM Version][npm-image]][npm-url] [![Downloads](http://img.shields.io/npm/dm/gulp-mux.svg)](http://badge.fury.io/js/gulp-mux)   
[![Build Status](https://travis-ci.org/mcfly-io/gulp-mux.svg?branch=master)](https://travis-ci.org/mcfly-io/gulp-mux) [![Test Coverage](https://codeclimate.com/github/mcfly-io/gulp-mux/badges/coverage.svg)](https://codeclimate.com/github/mcfly-io/gulp-mux) [![Code Climate](https://codeclimate.com/github/mcfly-io/gulp-mux/badges/gpa.svg)](https://codeclimate.com/github/mcfly-io/gulp-mux)   
[![Dependency Status](https://david-dm.org/mcfly-io/gulp-mux.svg)](https://david-dm.org/mcfly-io/gulp-mux) [![devDependency Status](https://david-dm.org/mcfly-io/gulp-mux/dev-status.svg)](https://david-dm.org/mcfly-io/gulp-mux#info=devDependencies) [![peerDependency Status](https://david-dm.org/mcfly-io/gulp-mux/peer-status.svg)](https://david-dm.org/mcfly-io/gulp-mux#info=peerDependencies)    


Gulp-mux is a utility for registering and running tasks using gulp based on simple javascript functions requiring dynamically generated parameters. It was written for using gulp with `generator-mcfly` but is useful in any project that employs gulp to manage several distribution targets or sub-apps. It contains a submodule to allow the user to specify which targets they want to use when running a given task from the command line, as well as the mode they want to use when running it, i.e. `dev` or `prod`.


[![NPM](https://nodei.co/npm/gulp-mux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mux)

## Usage
Require the module from your gulpfile using
```node
var gmux = require('gulp-mux');
```

### Motivation
This tool allows the user to run gulp tasks for files with different flags as suffixes in their filenames, indicating that there are multiple client-side sub-apps built in the same project tree. A single project may have a mobile app to be compiled with cordova, a web app that isn't, and others such as an interactive API visualizer. All of them talk to the same back-end and they often require similar front-end code, so building them side-by-side in the same client folder can leverage pre-existing folder structure and keep your code reuse high. The downside to this approach is that standard taskrunners like gulp, as well as many of the common tasks they use like style, browserify, or browsersync will not know the difference between the various apps if they are in the same place. `gulp-mux` was written to handle these cases by instructing gulp tasks how to run selectively on only the files associated with the desired targets.

### How it works
`gulp-mux` inspects the root level of your client folder for a number of files that match `index*.html`. It makes the assumption that each of the user's intended sub-apps has its own `index-<sub-app-name>.html` in that location. Thus a project with `mobile`, `web`, and `apitool` sub-apps is expected to have a client folder that looks like this:

```
client
├── ...
├── index-apitool.html
├── index-mobile.html
├── index-web.html
├── index.html
└── ...
```
*NB: This is part of  what is scaffolded by `yo mcfly:target`*

Once `gulp-mux` has inspected the client folder it finds that four targets are available: the three mentioned previously, `apitool`, `mobile`, and `web`, as well as the default target `app` from `index.html`. Running `getAllTargets` gives us these targets in an array:

```js
gmux.targets.getAllTargets(); // -> ['apitool', 'app', 'mobile', 'web']
```

>*The `app` target is the default target that `gulp-mux` expects when no target suffix is provided in the filename. Otherwise it works exactly like any other target available.*

Now that it has established which target are available, `gulp-mux` will be able to selectively create and run gulp tasks that work with only the files associated with the specified targets.

### Example Setup

Follow these steps to set up a simple `copy` task that uses `gulp-mux`.
Let us assume we have built already a gulpfile witha a simple copy task to copy everything in our `source` folder to our `destination` folder:
```js
'use strict';
var gulp = require('gulp');

var srcFolder = 'source/*',
    destFolder = 'destination';

gulp.task('copy', function() {
    gulp.src(srcFolder)
        .pipe(gulp.dest(destFolder));
});
```

The first thing we need to do is to create a constants object holding the `srcFolder` and `destFolder`. The issue is that gulp does not accept parameters when you run a task, because it is run from the command line. But because it's javascript, we can decouple the gulp task itself from the functions that it is running:
```js
var constants = {
    srcFolder: 'source/*',
    destFolder: 'destination'
};

var taskCopy = function(constant) {
    gulp.src(constant.srcFolder)
        .pipe(gulp.dest(constant.destFolder));
};

// add your top gulp tasks here
gulp.task('copy', function() {
    taskCopy(constants);
});
```

The benefit of this is that now we can reuse the same  `taskCopy` function with different sets of parameters:
```js
var constants1 = {
    srcFolder: 'source-one/*',
    destFolder: 'destination-one'
};
var constants2 = {
    srcFolder: 'source-two/*',
    destFolder: 'destination-two'
};

var taskCopy = function(const) {...};

gulp.task('copy:all', function() {
    taskCopy(constant1);
    taskCopy(constant2);
});
```

This is all good and simple and even allows us to run targeted copy tasks independenty, but we still are hard-coding the various constants. Let's address this by refactoring our constants object to use a dynamically templated target:
```js
var constants = {
    srcFolder: 'source-{{target}}/*',
    destFolder: 'destination-{{target}}'
};
```

Now we can use `gulp-mux`'s `resolveConstants` method to fill in our template:
```js
gmux.resolveConstants(constants, {'target': 'one'}); 
    // -> {srcFolder: 'source-one', destFolder: 'destination-one'}
```

And finally we can bring this back to our `copy:all` task using a `forEach` to iterate over all of the sources and destinations we require.
```js
var gmux = require('gulp-mux');

var constants = {
    srcFolder: 'source-{{target}}/*',
    destFolder: 'destination-{{target}}'
};

var targets = ['one', 'two'];

var taskCopy = function(const) {...};

gulp.task('copy:all', function() {
    targets.forEach(function(target) {
        taskCopy(gmux.resolveConstants(constants, {'template': target}));
    });
});
```

Finally let's refactor our copy task one more time to use `gulp-mux`'s `createAndRunTasks` method. 
```js
var gmux = require('gulp-mux');

var constants = {...};
var targets = ['one', 'two'];
var taskCopy = function(const) {...};

gulp.task('copy:all', function() {
    return gmux.createAndRunTasks(gulp, taskCopy, 'copy', targets, '', constants);
});
```

Now our final gulpfile should look like this.
```js
'use strict';
var gulp = require('gulp');
var gmux = require('gulp-mux');

var constants = {
    srcFolder: 'source-{{targetName}}/*',
    destFolder: 'destination-{{targetName}}'
};
var targets = ['one', 'two'];
var taskCopy = function(constant) {
    gulp.src(constant.srcFolder)
        .pipe(gulp.dest(constant.destFolder));
};

gulp.task('copy:all', function() {
    return gmux.createAndRunTasks(gulp, taskCopy, 'copy', targets, '', constants);
});
```
When we stick it into a project tree that looks like this:
```zsh
~/dev/Yoobic/copyProject > tree
.
├── destination-one
├── destination-two
├── gulpfile.js
├── node_modules
├── ├── gulp
│   │   └── ...
│   └── gulp-mux
│       └── ...
├── source-one
│   └── copyme
└── source-two
    └── copymetoo
```
We can run `gulp copy:all` from the command line and see that our files have been successfully copied.
```zsh
~/dev/Yoobic/copyProject > gulp copy:all
[15:17:19] Using gulpfile ~/dev/Yoobic/mux-test/gulpfile.js
[15:17:19] Starting 'copy:all'...
[15:17:19] Starting 'copy:T4Nc1'...
[15:17:19] Finished 'copy:T4Nc1' after 5.83 ms
[15:17:19] Starting 'copy:1nDM4'...
[15:17:19] Finished 'copy:1nDM4' after 1.21 ms
[15:17:19] Finished 'copy:all' after 12 ms
~/dev/Yoobic/copyProject > tree
.
├── destination-one
│   └── copyme
├── destination-two
│   └── copymetoo
├── gulpfile.js
├── node_modules
├── ├── gulp
│   │   └── ...
│   └── gulp-mux
│       └── ...
├── source-one
│   └── copyme
└── source-two
    └── copymetoo
```

## API
*The following assumes you required the module as decribed in the Usage section.*

### `gmux.targets` Methods
#### `setClientFolder(path)`
> *Set the client folder where the available targets live.*

This function tells `gulp-mux` which folder contains `index*.html` files that define which targets are available. If a client folder is not provided, the module will assume that the client folder is called `client` and is located in the root directory of your project.

#### `targetToSuffix(targetname)`
> *Gets the suffix name of a specific target*

#### `basenameToTarget(basename)`
> *Gets the target name of a target file*

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

Recent changes can be viewed on Github on the [Releases Page](https://github.com/mcfly-io/gulp-mux/releases)

## License

[npm-image]: https://badge.fury.io/js/gulp-mux.svg
[npm-url]: https://badge.fury.io/js/gulp-mux
