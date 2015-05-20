'use strict';

var targets = require('../../lib/targets');
var _ = require('lodash');
var clientFolder = './test/mocha/asset';

describe('targets', function() {

    beforeEach(function() {
        targets.setClientFolder(clientFolder);
        this.expectedTargets = ['app', 'mobile', 'web'];
    });

    describe('getAllTargets()', function() {
        it('should succeed', function() {
            var allTargets = targets.getAllTargets();
            assert.deepEqual(allTargets, this.expectedTargets);
        });

        it('should return [\'app\'] when no index file is present', function() {
            targets.setClientFolder('.');
            var allTargets = targets.getAllTargets();
            assert.deepEqual(allTargets, ['app']);
        });
    });

    describe('askFor()', function() {
        it('askForMultipleTargets() should return object args', function() {
            var args = targets.askForMultipleTargets('multiple');
            assert(_.isObject(args));
            //done();
        });

        it('askForMultipleTargets() should accept overrides', function() {
            var mode = 'prod';
            var target = ['web', 'mobile'];
            var args = targets.askForMultipleTargets('multiple', {
                mode: mode,
                target: target
            });
            assert(_.isObject(args));
            assert.equal(args.mode, mode);
            assert.deepEqual(args.target, target);
            //done();
        });

        it('askForMultipleTargets() should wrap string target overrides', function() {
            var target = 'web';
            var args = targets.askForMultipleTargets('multiple', {
                target: target
            });
            assert(_.isObject(args));
            assert.deepEqual(args.target, [target]);
            //done();
        });

        it('askForMultipleTargets() should ignore empty target string overrides', function() {
            var target = '';
            var args = targets.askForMultipleTargets('multiple', {
                target: target
            });
            assert(_.isObject(args));
            assert.deepEqual(args.target, this.expectedTargets);
            //done();
        });

        it('askForMultipleTargets() should ignore empty target array overrides', function() {
            var target = [];
            var args = targets.askForMultipleTargets('multiple', {
                target: target
            });
            assert(_.isObject(args));
            assert.deepEqual(args.target, this.expectedTargets);
            //done();
        });

        it('askForSingleTarget() should return object args', function() {
            var args = targets.askForSingleTarget('single');
            assert(_.isObject(args));
            //done();
        });

        it('askForSingleTarget() should accept overrides', function() {
            var mode = 'prod';
            var target = 'web';
            var args = targets.askForSingleTarget('multiple', {
                mode: mode,
                target: target
            });
            assert(_.isObject(args));
            assert.equal(args.mode, mode);
            assert.deepEqual(args.target, target);
            //done();
        });

        it('askForSingleTarget() should ignore empty target string overrides', function() {
            var target = '';
            var args = targets.askForSingleTarget('multiple', {
                target: target
            });
            assert(_.isObject(args));
            assert.deepEqual(args.target, [].concat(this.expectedTargets[0]));
            //done();
        });
    });

    describe('checkTargets()', function() {
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

        it('with not string args.mode should throw Error', function() {
            assert.throws(function() {
                targets.checkTargets({
                    target: ['app', 'web'],
                    mode: {}
                });
            }, 'mode should be a string instead of: [object Object]');
        });

        it('with unknown args.mode should throw Error', function() {
            assert.throws(function() {
                targets.checkTargets({
                    target: ['app', 'web'],
                    mode: 'dummy'
                });
            }, 'valid values for mode are "prod" or "dev",  instead got: dummy');
        });
    });

    describe('checkSingleTarget()', function() {
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
