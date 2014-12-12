'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');

var DEFAULT_TARGET = 'app';
var clientFolder = 'client';

var setClientFolder = exports.setClientFolder = function(folder) {
    clientFolder = folder;
};

var basenameToTarget = function(basename) {
    return basename === 'index' ? DEFAULT_TARGET : _(basename.split('-')).last();
};

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
    if(!args.target) {
        return;
    }
    var badTargets = _.difference([].concat(args.target), getAllTargets());
    if(badTargets.length !== 0) {
        throw new Error('The following targets were not found in the client folder: ' + badTargets.join(','));
    }
};

exports.askForTargets = function() {
    return yargs.usage('Run the gulp task.\nUsage: $0')
        .alias('t', 'target')
        .example('$0', 'Run the gulp task for all available targets.')
        .example('$0 -t a', 'Run the gulp task, only for target a.')
        .example('$0 -t a -t b --target c', 'Run the gulp task, for targets a, b, and c.')
        .describe('t', 'Run the gulp task for each of the specified distribution target[s]')
        .check(checkTargets)
        .argv;

};