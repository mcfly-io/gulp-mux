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
        assert.equal(typeof index.targets, 'function');
    });

});