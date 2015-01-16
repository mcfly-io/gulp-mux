/**
 * @module gulp-mux/targets
 */

'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var chalk = require('chalk');
var gutil = require('gulp-util');

var DEFAULT_TARGET = 'app';
var clientFolder = 'client';

/**
 * Set the client folder where the available targets live
 * @method setClientFolder
 * @param {String} folder - The path to the client folder
 */
var setClientFolder = exports.setClientFolder = function(folder) {
    clientFolder = folder;
};

/**
 * Gets the target name from a file name
 * @method  basenameToTarget
 * @param  {String} basename - The file name
 *
 * @returns {String} - The target name
 */
var basenameToTarget = exports.basenameToTarget = function(basename) {
    return basename === 'index' ? DEFAULT_TARGET : _(basename.split('-')).last();
};

/**
 * Gets the suffix name of a specific target
 * @method  targetToSuffix
 * @param  {String} targetname - The name of the target
 *
 * @returns {String} - The suffix name
 */
var targetToSuffix = exports.targetToSuffix = function(targetname) {
    return targetname === DEFAULT_TARGET ? '' : '-' + targetname;
};

/**
 * Inspect the client folder set with setClientFolder for files with a name
 * that matches index-<target>.html. An array of <target> names is returned
 * @method getAllTargets
 *
 * @returns {String[]} - The array of target names
 */
var getAllTargets = exports.getAllTargets = function() {
    var re = /index(|-[^\.]+)\.html/;

    return _(fs.readdirSync(clientFolder))
        .filter(function(name) {
            return re.test(name);
        })
        .map(function(name) {
            var filename = path.basename(name, '.html');
            return basenameToTarget(filename);
        })
        .sortBy()
        .value();

};

var checkTargets = exports.checkTargets = function(args, opts) {

    var message;
    if(!args.target) {
        return;
    }
    var badTargets = _.difference([].concat(args.target), getAllTargets());
    if(badTargets.length !== 0) {
        message = 'The following targets were not found in the folder "' + clientFolder + '": ' + badTargets.join(',');
        gutil.log(chalk.red('(ERR) ' + message));

        throw new Error(message);
    }
    if(!args.mode) {
        return;
    }

    if(!_.isString(args.mode)) {
        message = 'mode should be a string instead of: ' + args.mode.toString();
        gutil.log(chalk.red('(ERR) ' + message));

        throw new Error(message);
    }

    if(args.mode !== 'prod' && args.mode !== 'dev') {
        message = 'valid values for mode are "prod" or "dev",  instead got: ' + args.mode.toString();
        gutil.log(chalk.red('(ERR) ' + message));

        throw new Error(message);
    }
};

var checkSingleTarget = exports.checkSingleTarget = function(args, opts) {
    var message;
    checkTargets(args, opts);
    if(_.isArray(args.target) && args.target.length > 1) {
        message = 'Only a single target can be used with this task, instead got: ' + args.target.toString();
        gutil.log(chalk.red('(ERR) ' + message));
        throw new Error(message);
    }
};

var askForTargets = function(taskname, defaultTargets, defaultMode, checkFn) {
    taskname = taskname || '';
    delete require.cache[require.resolve('yargs')];
    var yargs = require('yargs');
    var argv = yargs.usage(chalk.cyan('Usage: $0 ' + taskname))
        .alias('t', 'target')
        .default('t', defaultTargets)
        .alias('m', 'mode')
        .string('m')
        .default('m', defaultMode)
        .example(chalk.white('$0 ' + taskname), chalk.cyan('Run the gulp task for all available targets.'))
        .example(chalk.white('$0 ' + taskname + ' -t a'), chalk.cyan('Run the gulp task, only for target a.'))
        .example(chalk.white('$0 ' + taskname + ' -t a -t b --target c'), chalk.cyan('Run the gulp task, for targets a, b, and c.'))
        .example(chalk.white('$0 ' + taskname + ' -t a -t b -m prod'), chalk.cyan('Run the gulp task, for targets a, b in prod mode.'))
        .describe('t', chalk.cyan('Run the gulp task for each of the specified distribution target[s]'))
        .describe('m', chalk.cyan('Run the gulp task in the specified mode (prod or dev)'))
        .check(checkFn)
        .argv;
    gutil.log('Running task \'' + chalk.cyan(taskname) + '\' with targets ' + chalk.yellow(argv.target.toString()) + ' in mode ' + chalk.yellow(argv.mode));
    return argv;
};

/**
 * Create and return the yargs object containing the multiple targets provided
 * on the command line with -t and the mode if provided with -m.
 * @method askForMultipleTargets
 * @param {String} taskname - The name of the task that will accept multiple targets.
 *
 * @returns {Object} - The yargs object
 */
exports.askForMultipleTargets = function(taskname) {
    return askForTargets(taskname, getAllTargets(), 'dev', checkTargets);
};

/**
 * Create and return the yargs object containing the single target provided on
 * the command line with -t and the mode if provided with -m.
 * @method askForSingleTarget
 * @param {String} taskname - The name of the task that will accept multiple targets.
 *
 * @returns {Object} - The yargs object
 */
exports.askForSingleTarget = function(taskname) {
    return askForTargets(taskname, getAllTargets()[0], 'dev', checkSingleTarget);
};
