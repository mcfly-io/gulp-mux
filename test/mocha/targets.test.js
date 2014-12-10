'use strict';

var targets = require('../../lib/targets');

describe('targets', function() {
    var clientFolder = 'www';
    var defaultTarget = 'app';

    it('should throw an error when called without clientFolder', function() {
        assert.throws(targets, Error);
    });

    it('should throw an error when called with falsey clientFolder', function() {
        assert.throws(targets.bind(null, ''), Error);
    });

    it('should throw an error when called with falsey clientFolder but a valid defaultTarget', function() {
        assert.throws(targets.bind(null, '', 'app'), Error);
    });

    it('should succeed when called with a valid clientFolder', function() {
        assert.ok(targets.bind(null, clientFolder));
    });

    it('should succeed when called with a valid clientFolder and defaultTarget', function() {
        assert.ok(targets.bind(null, clientFolder, defaultTarget));
    });

    beforeEach(function() {
        this.constants = require('./asset/constants.js');

        this.add = function(a, b) {
            return a + b;
        };
    });

    xit('should throw an error when called without passing a clientFolder argument.', function() {
        assert.throws(targets, /clientFolder\ constant\ not\ set/);
    });
});