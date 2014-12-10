'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var clientFolder = require('./constantsConfig').clientFolder;
var BASE_TARGET_NAME = require('./constantsConfig').BASE_TARGET_NAME;

var yargs = require('yargs');

var targetToSuffix = function(target) {
    return target === BASE_TARGET_NAME ? '' : '-' + target;
};

var basenameToTarget = function(basename) {
    return basename === 'index' ? BASE_TARGET_NAME : _(basename.split('-')).last();
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

var checkTargets = function(args, opts) {
    if(!args.target) { return; }
    var badTargets = _.difference([].concat(args.target), getAllTargets());
    if(badTargets.length !== 0) {
        throw new Error(['The following targets were not found in the client folder:'].concat(this.badTargets).join('\n└'));
    }
};

var argv = yargs.usage('Run the gulp task.\nUsage: $0')
    .alias('t', 'target')
    .example('$0', 'Run the gulp task for all available targets.')
    .example('$0 -t a', 'Run the gulp task, only for target a.')
    .example('$0 -t a -t b --target c', 'Run the gulp task, for targets a, b, and c.')
    .describe('t', 'Run the gulp task for each of the specified target[s]')
    .check(checkTargets)
    .argv;

module.exports = function() {
    var targetsToRun = [].concat(argv.target || getAllTargets());
    return _(targetsToRun).map(targetToSuffix).value();
};