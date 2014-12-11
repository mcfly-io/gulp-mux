'use strict';

var fs = require('fs');
var _ = require('lodash');

describe('targets', function() {
    var clientFolder = 'test/mocha/asset';
    var defaultTarget = 'app';

    describe('require', function() {
        it('should throw an error when called without clientFolder', function() {
            assert.throws(require('../../lib/targets'), Error);
        });

        it('should throw an error when called without clientFolder', function() {
            assert.throws(require('../../lib/targets'), Error);
        });

        it('should throw an error when called with falsey clientFolder', function() {
            assert.throws(require('../../lib/targets').bind(null, ''), Error);
        });

        it('should succeed when called with a clientFolder', function() {
            assert.ok(require('../../lib/targets').bind(null, clientFolder));
        });

        it('should succeed when called with a  clientFolder and defaultTarget', function() {
            assert.ok(require('../../lib/targets').bind(null, clientFolder, defaultTarget));
        });

        it('should succeed when called with a clientFolder, defaultTarget, and argv', function() {
            assert.ok(require('../../lib/targets').bind(null, clientFolder, defaultTarget, {}));
        });
    });

    describe('internals', function() {
        // beforeEach(function() {
        //    var targets = require('../../lib/targets')(clientFolder, null, null);
        // });

        it('should find all targets when required with only the clientFolder', function() {
            var targets = require('../../lib/targets')(clientFolder, null, null);

            var expected = {
                allTargets: ['app', 'web', 'mobile'],
                names: ['app', 'web', 'mobile'],
                suffixes: ['', '-web', '-mobile'],
                templates: [
                    {targetName: 'app', targetSuffix: ''},
                    {targetName: 'web', targetSuffix: '-web'},
                    {targetName: 'mobile', targetSuffix: '-mobile'}
                ]
            };

            assert.deepEqual(_(targets.allTargets).sortBy().value(), _(expected.allTargets).sortBy().value());
            assert.deepEqual(_(targets.names).sortBy().value(), _(expected.names).sortBy().value());
            assert.deepEqual(_(targets.suffixes).sortBy().value(), _(expected.suffixes).sortBy().value());
            assert.deepEqual(_(targets.templates).sortBy(function(temp) { return temp.targetName; }).value(),
                        _(expected.templates).sortBy(function(temp) { return temp.targetName; }).value());
        });
    });
});