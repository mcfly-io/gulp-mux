'use strict';

var targets = require('../../lib/targets');
var _ = require('lodash');

var clientFolder = './test/mocha/asset';
describe('targets', function() {

    beforeEach(function() {
        targets.setClientFolder(clientFolder);
        this.expectedTargets = ['app', 'mobile', 'web'];
    });

    describe('#getAllTargets()', function() {
        it('should succeed', function() {
            var allTargets = targets.getAllTargets();
            assert.deepEqual(allTargets, this.expectedTargets);
        });
    });

    describe('#askFor', function() {
        xit('should return object args', function(done) {
            var args = require('../../lib/targets').askForMultipleTargets('multiple');
            assert(_.isObject(args));
            done();
        });
        it('should return object args', function(done) {
            var args = require('../../lib/targets').askForSingleTarget('single');
            assert(_.isObject(args));
            done();
        });
    });

    describe('#checkTargets()', function() {
        it('with no args.target should succeed', function() {
            assert.doesNotThrow(function() {
                targets.checkTargets({});
            });

        });

        it('with valid args.target should succeed', function() {
            assert.doesNotThrow(function() {
                targets.checkTargets({
                    target: ['app', 'web']
                });
            });

        });

        it('with unfound args.target should throw Error', function() {
            assert.throws(function() {
                targets.checkTargets({
                    target: ['app', 'webx']
                });
            }, 'The following targets were not found in the folder "' + clientFolder + '": webx');
        });
    });

    describe('#checkSingleTarget', function() {
        it('with no args.target should succeed', function() {
            assert.doesNotThrow(function() {
                targets.checkSingleTarget({});
            });

        });

        it('with multiple targets should throw Error', function() {
            assert.throws(function() {
                targets.checkSingleTarget({
                    target: ['app', 'webx']
                });
            }, 'The following targets were not found in the folder "' + clientFolder + '": webx');
        });

        it('with valid args.target should succeed', function() {
            assert.throws(function() {
                targets.checkSingleTarget({
                    target: ['app', 'web']
                });
            }, 'Only a single target can be used with this task, instead got: app,web');

        });

        it('with unfound args.target should throw Error', function() {
            assert.throws(function() {
                targets.checkSingleTarget({
                    target: ['app', 'webx']
                });
            }, 'The following targets were not found in the folder "' + clientFolder + '": webx');
        });

    });
});
