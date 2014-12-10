'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');

module.exports = function(clientFolder, defaultTarget) {
    if(!clientFolder) { throw new Error('Gulp clientFolder constant not set. Please update the gulp_tasks/common/constants.js'); }
    defaultTarget = defaultTarget || 'app';

    var targetToSuffix = function(target) {
        return target === defaultTarget ? '' : '-' + target;
    };

    var basenameToTarget = function(basename) {
        return basename === 'index' ? defaultTarget : _(basename.split('-')).last();
    };

    var getAllTargets = function() {
        var re = /index(|-[^\.]+)\.html/;

        return _.chain(fs.readdirSync(clientFolder))
            .filter(function(name) {
                return re.test(name);
            })
            .map(function(name) {
                var filename = path.basename(name, '.html');
                // console.log('Filename', filename);
                return basenameToTarget(filename);
            })
            .value();
    };

    var allTargets = process.env.TARGETS || getAllTargets();

    var checkTargets = function(args, opts) {
        if(!args.target) { return; }
        var badTargets = _.difference([].concat(args.target), allTargets);
        if(badTargets.length !== 0) {
            throw new Error(['The following targets were not found in the client folder:'].concat(this.badTargets).join('\n└'));
        }
    };

    var argv = yargs.usage('Run the gulp task.\nUsage: $0')
        .alias('t', 'target')
        .example('$0', 'Run the gulp task for all available targets.')
        .example('$0 -t a', 'Run the gulp task, only for target a.')
        .example('$0 -t a -t b --target c', 'Run the gulp task, for targets a, b, and c.')
        .describe('t', 'Run the gulp task for each of the specified distribution target[s]')
        .check(checkTargets)
        .argv;

    var targetNames = [].concat(argv.target || allTargets);

    var targetSuffixes = _(targetNames).map(targetToSuffix).value();

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