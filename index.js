'use strict';

var mux = require('./lib/mux');
var targets = require('./lib/targets');

module.exports = {
    resolveConstants: mux.resolveConstants,
    createAndRunTasks: mux.createAndRunTasks,
    sanitizeWatchFolders: mux.sanitizeWatchFolders
};

module.exports.targets = {
    getAllTargets: targets.getAllTargets,
    askForMultipleTargets: targets.askForMultipleTargets,
    askForSingleTarget: targets.askForSingleTarget,
    setClientFolder: targets.setClientFolder,
    targetToSuffix: targets.targetToSuffix,
    basenameToTarget: targets.basenameToTarget
};
