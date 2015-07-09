/**
 * @module gulp-mux/targets
 */

'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

var DEFAULT_TARGET = 'app';
var clientFolder = 'client';

/**
 * Set the client folder where the available targets live
 * @method setClientFolder
 * @param {String} folder - The path to the client folder
 */
var setClientFolder = function(folder) {
    clientFolder = folder;
};

/**
 * Gets the target name from a file name
 * @method  basenameToTarget
 * @param  {String} basename - The file name
 *
 * @returns {String} - The target name
 */
var basenameToTarget = function(basename) {
    return basename === 'index' ? DEFAULT_TARGET : _(basename.split('-')).last();
};

/**
 * Gets the suffix name of a specific target
 * @method  targetToSuffix
 * @param  {String} targetname - The name of the target
 *
 * @returns {String} - The suffix name
 */
var targetToSuffix = function(targetname) {
    return targetname === DEFAULT_TARGET ? '' : '-' + targetname;
};

/**
 * Inspect the client folder set with setClientFolder for files with a name
 * that matches index-<target>.html. An array of <target> names is returned
 * @method getAllTargets
 *
 * @returns {String[]} - The array of target names
 */
var getAllTargets = function() {
    var re = /index(|-[^\.]+)\.html/;

    var targets = _(fs.readdirSync(clientFolder))
        .filter(function(name) {
            return re.test(name);
        })
        .map(function(name) {
            var filename = path.basename(name, '.html');
            return basenameToTarget(filename);
        })
        .sortBy()
        .value();

    if (targets.length === 0) {
        targets = [DEFAULT_TARGET];
    }
    return targets;
};

var checkTargets = function(args, opts) {

    var message;
    if (!args.target) {
        return true;
    }
    var badTargets = _.difference([].concat(args.target), getAllTargets());
    if (badTargets.length !== 0) {
        message = 'The following targets were not found in the folder "' + clientFolder + '": ' + badTargets.join(',');
        gutil.log(gutil.colors.red('(ERR) ' + message));

        throw new Error(message);
    }

    if (!args.mode) {
        return true;
    }

    if (!_.isString(args.mode)) {
        message = 'mode should be a string instead of: ' + args.mode.toString();
        gutil.log(gutil.colors.red('(ERR) ' + message));

        throw new Error(message);
    }

    if (args.mode !== 'prod' && args.mode !== 'dev') {
        message = 'valid values for mode are "prod" or "dev",  instead got: ' + args.mode.toString();
        gutil.log(gutil.colors.red('(ERR) ' + message));

        throw new Error(message);
    }

    return true;
};

var checkSingleTarget = function(args, opts) {
    var message;
    var retval = checkTargets(args, opts);
    if (_.isArray(args.target) && args.target.length > 1) {
        message = 'Only a single target can be used with this task, instead got: ' + args.target.toString();
        gutil.log(gutil.colors.red('(ERR) ' + message));
        throw new Error(message);
    }
    return retval;
};

var askForTargets = function(taskname, opts) {
    taskname = taskname || '';

    delete require.cache[require.resolve('yargs')];
    var yargs = require('yargs');
    var argv = yargs.usage(gutil.colors.cyan('Usage: $0 ' + taskname))
        .alias('t', 'target')
        .default('t', opts.defaultTargets)
        .alias('m', 'mode')
        .string('m')
        .default('m', 'dev')
        .example(gutil.colors.white('$0 ' + taskname), gutil.colors.cyan('Run the gulp task for all available targets.'))
        .example(gutil.colors.white('$0 ' + taskname + ' -t a'), gutil.colors.cyan('Run the gulp task, only for target a.'))
        .example(gutil.colors.white('$0 ' + taskname + ' -t a -t b --target c'), gutil.colors.cyan('Run the gulp task, for targets a, b, and c.'))
        .example(gutil.colors.white('$0 ' + taskname + ' -t a -t b -m prod'), gutil.colors.cyan('Run the gulp task, for targets a, b in prod mode.'))
        .describe('t', gutil.colors.cyan('Run the gulp task for each of the specified distribution target[s]'))
        .describe('m', gutil.colors.cyan('Run the gulp task in the specified mode (prod or dev)'))
        .check(opts.checkFn)
        .argv;

    if (!_(opts.target).isEmpty() && !_(opts.target).sortBy().isEqual(_(argv.target).sortBy())) {
        var targetMessage = '(' + gutil.colors.yellow('WARNING') + ') Task \'' + gutil.colors.cyan(taskname) + '\' is overriding command line targets to ' + gutil.colors.yellow(opts.target.toString());
        gutil.log(gutil.colors.green(targetMessage));
        argv.t = argv.target = opts.target;
    }

    if (opts.mode && opts.mode !== argv.mode) {
        var modeMessage = '(' + gutil.colors.yellow('WARNING') + ') Task \'' + gutil.colors.cyan(taskname) + '\' is overriding command line mode to ' + gutil.colors.yellow(opts.mode);
        gutil.log(gutil.colors.green(modeMessage));
        argv.m = argv.mode = opts.mode;
    }

    opts.checkFn(argv, {});

    gutil.log('Running task \'' + gutil.colors.cyan(taskname) + '\' with targets ' + gutil.colors.yellow(argv.target.toString()) + ' in mode ' + gutil.colors.yellow(argv.mode));
    return argv;
};

/**
 * Create and return the yargs object containing the multiple targets provided
 * on the command line with -t and the mode if provided with -m.
 * @method askForMultipleTargets
 * @param {String} taskname - The name of the task that will accept multiple targets.
 * @param {Object} opts - (optional) Overrides the targets & mode from the command-line
 *
 * @returns {Object} - The yargs object
 */
var askForMultipleTargets = function(taskname, opts) {
    if (opts && opts.target && opts.target.length > 0) {
        opts.target = [].concat(opts.target);
    }
    opts = opts || {};
    opts = {
        defaultTargets: [].concat(getAllTargets()),
        checkFn: checkTargets,
        target: opts.target,
        mode: opts.mode
    };
    return askForTargets(taskname, opts);
};

/**
 * Create and return the yargs object containing the single target provided on
 * the command line with -t and the mode if provided with -m.
 * @method askForSingleTarget
 * @param {String} taskname - The name of the task that will accept multiple targets.
 * @param {Object} opts - (optional) Overrides the targets & mode from the command-line
 *
 * @returns {Object} - The yargs object
 */
var askForSingleTarget = function(taskname, opts) {
    if (opts && _(opts.target).isArray()) {
        opts.target = [].concat(opts.target[0]);
    }
    opts = opts || {};
    opts = {
        defaultTargets: [].concat(getAllTargets()[0]),
        checkFn: checkSingleTarget,
        target: opts.target,
        mode: opts.mode
    };
    return askForTargets(taskname, opts);
};

module.exports = {
    setClientFolder: setClientFolder,
    basenameToTarget: basenameToTarget,
    targetToSuffix: targetToSuffix,
    getAllTargets: getAllTargets,
    checkTargets: checkTargets,
    checkSingleTarget: checkSingleTarget,
    askForMultipleTargets: askForMultipleTargets,
    askForSingleTarget: askForSingleTarget
};