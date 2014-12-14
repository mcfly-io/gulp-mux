'use strict';

var mux = require('./lib/mux');
var targets = require('./lib/targets');

module.exports = mux;

module.exports.targets = {
    getAllTargets: targets.getAllTargets,
    askForMultipleTargets: targets.askForMultipleTargets,
    askForSingleTarget: targets.askForSingleTarget,
    setClientFolder: targets.setClientFolder
};
