'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');

/**
 * Return the arguments object created by yargs for targets
 * @param {Function} checkTargets - The function to check for invalid targets.
 *
 * @returns {Object} - The arguments object
 */
var yargsArgv = function(checkTargets) {
    return yargs.usage('Run the gulp task.\nUsage: $0')
        .alias('t', 'target')
        .example('$0', 'Run the gulp task for all available targets.')
        .example('$0 -t a', 'Run the gulp task, only for target a.')
        .example('$0 -t a -t b --target c', 'Run the gulp task, for targets a, b, and c.')
        .describe('t', 'Run the gulp task for each of the specified distribution target[s]')
        .check(checkTargets)
        .argv;
};

/**
 * Transform a target name into a filename suffix, e.g. 'web' -> '-web'
 * @param {String} target - The target name to convert to a filename suffix
 * @param {String} defaultTarget - The default target name of the distribution target for index.html (i.e. no suffix)
 *
 * @returns {String} - The filename suffix
 */
var targetToSuffix = function(target, defaultTarget) {
    return target === defaultTarget ? '' : '-' + target;
};

/**
 * Transform a basename of a file into a target name, e.g 'index-mobile' -> 'mobile'
 * @param {String} basename - The basename to convert to a target name
 * @param {String} defaultTarget - The default target name of the distribution target for index.html (i.e. no suffix)
 *
 * @returns {String} - The target name
 */
var basenameToTarget = function(basename, defaultTarget) {
    return basename === 'index' ? defaultTarget : _(basename.split('-')).last();
};

/**
 * Get the list of valid target names based on all index*{-*}.html files found in the clientFolder
 * @param {String} clientFolder - The location relative to process.cwd of the  working clientFolder containing index*{-*}.html files
 * @param {String} defaultTarget - The default target name of the distribution target for index.html (i.e. no suffix)
 *
 * @returns {Array} - The array of all valid target names
 */
var getAllTargets = function(clientFolder, defaultTarget) {
    var re = /index(|-[^\.]+)\.html/;

    return _.chain(fs.readdirSync(clientFolder))
        .filter(function(name) {
            return re.test(name);
        })
        .map(function(name) {
            var filename = path.basename(name, '.html');
            // console.log('Filename', filename);
            return basenameToTarget(filename, defaultTarget);
        })
        .value();
};

/**
 * Return the valid targets selected by command-line or all targets in client folder
 * @param {String} clientFolder - The location relative to process.cwd of the  working clientFolder containing index*{-*}.html files
 * @param {String} defaultTarget - The default target name of the distribution target for index.html (i.e. no suffix)
 * @param {Object} argv - The arguments object created by yargsArgv with the command-line arguments - should normally be left empty
 *
 * @returns {Object} - The module.exports object, containing all valid target names,
 */
module.exports = function(clientFolder, defaultTarget, argv) {
    if(!clientFolder || typeof clientFolder !== 'string') {
        throw new Error('Gulp clientFolder constant not set. Please update the gulp_tasks/common/constants.js');
    }
    defaultTarget = defaultTarget || 'app';

    var allTargets = process.env.TARGETS || getAllTargets(clientFolder, defaultTarget);

    var checkTargets = function(args, opts) {
        if(!args.target) { return; }
        var badTargets = _.difference([].concat(args.target), allTargets);
        if(badTargets.length !== 0) {
            throw new Error(['The following targets were not found in the client folder:'].concat(this.badTargets).join('\n└'));
        }
    };

    // argv should normally not be set.
    if(argv) {
        checkTargets(argv);
    } else {
        argv = yargsArgv(checkTargets);
    }

    var targetNames = [].concat(argv.target || allTargets);

    var targetSuffixes = _(targetNames).map(function(targetName) {
            return targetToSuffix(targetName, defaultTarget);
        }).value();

    var templateKeys = ['targetName', 'targetSuffix'];

    var templates = _(targetNames).zip(targetSuffixes).map(function(el) {
            return _.zipObject(templateKeys, el);
        }).value();

    return {
        allTargets: allTargets,
        names: targetNames,
        suffixes: targetSuffixes,
        templates: templates,
        targetToSuffix: targetToSuffix,
        basenameToTarget: basenameToTarget
    };
};