'use strict';

var targets = require('../../lib/targets');
var _ = require('lodash');

describe('targets', function() {

    beforeEach(function() {
        targets.setClientFolder('./test/mocha/asset');
        this.expectedTargets = ['app', 'mobile', 'web'];
    });

    describe('#getAllTargets()', function() {
        it('should succeed', function() {
            var allTargets = targets.getAllTargets();
            assert.deepEqual(allTargets, this.expectedTargets);
        });
    });

    describe('#askForTargets()', function() {
        it('should return object args', function() {
            var args = targets.askForTargets();
            assert(_.isObject(args));
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
            }, 'The following targets were not found in the client folder: webx');
        });
    });
});