'use strict';

var index = require('../../index.js');

describe('index', function() {
    beforeEach(function() {

    });

    it('should export mux', function() {
        assert.equal(typeof index, 'object');
    });

    it('should export mux.createAndRunTasks', function() {
        assert.equal(typeof index.createAndRunTasks, 'function');
    });

    it('should export targets', function() {
        assert.equal(typeof index.targets, 'object');
    });

    it('should export targets.getAllTargets', function() {
        assert.equal(typeof index.targets.getAllTargets, 'function');
    });

    it('should export targets.setClientFolder', function() {
        assert.equal(typeof index.targets.setClientFolder, 'function');
    });

    it('should export targets.askForMultipleTargets', function() {
        assert.equal(typeof index.targets.askForMultipleTargets, 'function');
    });

    it('should export targets.askForSingleTarget', function() {
        assert.equal(typeof index.targets.askForSingleTarget, 'function');
    });

    it('should export targets.targetToSuffix', function() {
        assert.equal(typeof index.targets.targetToSuffix, 'function');
    });

    it('should export targets.basenameToTarget', function() {
        assert.equal(typeof index.targets.basenameToTarget, 'function');
    });
});
