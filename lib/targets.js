'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');
var chalk = require('chalk');
var gutil = require('gulp-util');

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
        var message = 'The following targets were not found in the folder "' + clientFolder + '": ' + badTargets.join(',');
        gutil.log(chalk.red('(ERR) ' + message));

        throw new Error(message);
    }
};

exports.askForTargets = function(taskname) {
    taskname = taskname || '';
    return yargs.usage(chalk.cyan('Usage: $0 ' + taskname))
        .alias('t', 'target')
        .example(chalk.white('$0 ' + taskname), chalk.cyan('Run the gulp task for all available targets.'))
        .example(chalk.white('$0 ' + taskname + ' -t a'), chalk.cyan('Run the gulp task, only for target a.'))
        .example(chalk.white('$0 ' + taskname + ' -t a -t b --target c'), chalk.cyan('Run the gulp task, for targets a, b, and c.'))
        .describe('t', chalk.cyan('Run the gulp task for each of the specified distribution target[s]'))
        .check(checkTargets)
        .argv;

};