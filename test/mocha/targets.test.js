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
            var targets = require('../../lib/targets')(clientFolder);

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

        it('should change defaultTarget name when provided', function() {
            var targets = require('../../lib/targets')(clientFolder, 'base');

            var expected = {
                allTargets: ['base', 'web', 'mobile'],
                names: ['base', 'web', 'mobile'],
                suffixes: ['', '-web', '-mobile'],
                templates: [
                    {targetName: 'base', targetSuffix: ''},
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

        it('should return only one target when specified', function() {
            var targets = require('../../lib/targets')(clientFolder, 'base', {target: 'web'});

            var expected = {
                allTargets: ['base', 'web', 'mobile'],
                names: ['web'],
                suffixes: ['-web'],
                templates: [{targetName: 'web', targetSuffix: '-web'}]
            };

            assert.deepEqual(_(targets.allTargets).sortBy().value(), _(expected.allTargets).sortBy().value());
            assert.deepEqual(_(targets.names).sortBy().value(), _(expected.names).sortBy().value());
            assert.deepEqual(_(targets.suffixes).sortBy().value(), _(expected.suffixes).sortBy().value());
            assert.deepEqual(_(targets.templates).sortBy(function(temp) { return temp.targetName; }).value(),
                        _(expected.templates).sortBy(function(temp) { return temp.targetName; }).value());
        });

        it('should return only the targets specified', function() {
            var targets = require('../../lib/targets')(clientFolder, 'base', {target: ['web', 'mobile']});

            var expected = {
                allTargets: ['base', 'web', 'mobile'],
                names: ['web', 'mobile'],
                suffixes: ['-web', '-mobile'],
                templates: [
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

        it('should return the defaultTarget when specified', function() {
            var targets = require('../../lib/targets')(clientFolder, 'base', {target: ['base', 'mobile']});

            var expected = {
                allTargets: ['base', 'web', 'mobile'],
                names: ['base', 'mobile'],
                suffixes: ['', '-mobile'],
                templates: [
                    {targetName: 'base', targetSuffix: ''},
                    {targetName: 'mobile', targetSuffix: '-mobile'}
                ]
            };

            assert.deepEqual(_(targets.allTargets).sortBy().value(), _(expected.allTargets).sortBy().value());
            assert.deepEqual(_(targets.names).sortBy().value(), _(expected.names).sortBy().value());
            assert.deepEqual(_(targets.suffixes).sortBy().value(), _(expected.suffixes).sortBy().value());
            assert.deepEqual(_(targets.templates).sortBy(function(temp) { return temp.targetName; }).value(),
                        _(expected.templates).sortBy(function(temp) { return temp.targetName; }).value());
        });

        it('should throw when an invalid target is specified', function() {
            assert.throws(function() {
                require('../../lib/targets')(clientFolder, 'base', {target: ['base', 'bo']});
            }, Error);

            assert.throws(function() {
                require('../../lib/targets')(clientFolder, 'base', {target: ['base', 'bo']});
            }, Error);

            assert.throws(function() {
                require('../../lib/targets')(clientFolder, 'base', {target: 'app'});
            }, Error);
        });

    });
});