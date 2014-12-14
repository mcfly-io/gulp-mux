'use strict';

var mux = require('../../lib/mux.js');

describe('mux', function() {
    beforeEach(function() {
        this.constants = require('./asset/constants.js');
        this.add = function(a, b) {
            return a + b;
        };
    });

    describe('#resolveConstants()', function() {
        beforeEach(function() {

        });

        it('should succeed', function() {
            var templateData = {
                targetName: 'web',
                targetSuffix: '-web',
                mode: 'prod'
            };
            var ret = mux.resolveConstants(this.constants, templateData);
            assert.deepEqual(ret.targetName, templateData.targetName);
            assert.deepEqual(ret.targetSuffix, templateData.targetSuffix);
            assert.deepEqual(ret.mode, templateData.mode);
        });

        it('with constants null should return null', function() {
            var ret = mux.resolveConstants(null);
            assert.equal(ret, null);
        });

        it('with constants undefined should return null', function() {
            var ret = mux.resolveConstants(undefined);
            assert.equal(ret, null);
        });

        it('with target null should return original constants', function() {
            var ret = mux.resolveConstants(this.constants);
            assert.equal(ret.targetName, '');
            assert.equal(ret.targetSuffix, '');
            assert.equal(ret.mode, '');

        });
    });

    describe('#createSingleFn', function() {

        beforeEach(function() {

        });

        it('#createSingleFn() should succeed', function() {
            var ret = mux.createSingleFn(this.add, 12, 13);
            assert.equal(ret(), 25);
        });

        it('#createSingleFn() with null fn should throw', function() {
            assert.throws(function() {
                mux.createSingleFn(null);
            }, Error);
        });

        it('#createSingleFn() with null fn should throw', function() {
            assert.throws(function() {
                mux.createSingleFn(null);
            }, Error);
        });
    });

    describe('createArrayFn', function() {
        beforeEach(function() {

        });

        it('with valid fn and args should succeed', function() {
            var ret = mux.createArrayFn(this.add, [
                [12, 13],
                [6, 9]
            ]);
            assert.isArray(ret);
            assert.lengthOf(ret, 2);
            assert.equal(ret[0](), 25);
            assert.equal(ret[1](), 15);

        });

        it('with null fn should throw Error', function() {
            assert.throws(function() {
                mux.createArrayFn(null, []);
            }, 'fn must be a function');
        });

        it('with not array args should throw Error', function() {
            assert.throws(function() {
                mux.createArrayFn(this.add, {
                    a: 'a'
                });
            }.bind(this), Error);
        });

        it('with no args should succeed', function() {
            var ret = mux.createArrayFn(function() {
                return 'ok';
            });

            assert.equal(ret[0](), 'ok');
        });
    });

    describe('#createTasks', function() {
        beforeEach(function() {
            this.gulp = require('gulp');
            this.copy = function(constants) {
                return constants;
            };
            this.targets = ['app', 'mobile', 'web'];
            this.mode = 'prod';
        });

        it('should succeed', function() {

            var tasks = mux.createTasks(this.gulp, this.copy, 'copy', this.targets, this.mode, this.constants);
            assert.lengthOf(tasks, 3);

            assert.equal(this.gulp.tasks[tasks[0]].fn().targetSuffix, '');
            assert.equal(this.gulp.tasks[tasks[1]].fn().targetSuffix, '-mobile');
            assert.equal(this.gulp.tasks[tasks[2]].fn().targetSuffix, '-web');

        });

        it('with target as a single string should transform to array and succeed', function() {
            var tasks = mux.createTasks(this.gulp, this.copy, 'copy', 'web', this.constants);
            assert.lengthOf(tasks, 1);
        });

        it('with no name should succeed', function() {

            var tasks = mux.createTasks(this.gulp, this.copy, null, this.targets, this.mode, this.constants);
            assert.lengthOf(tasks, 3);
            assert.equal(this.gulp.tasks[tasks[0]].fn().targetSuffix, '');
            assert.equal(this.gulp.tasks[tasks[1]].fn().targetSuffix, '-mobile');
            assert.equal(this.gulp.tasks[tasks[2]].fn().targetSuffix, '-web');

        });

        it('with null fn should throw Error', function() {
            assert.throws(function() {
                mux.createTasks(this.gulp, null, 'copy', this.targets, this.mode, this.constants);
            }.bind(this), Error);

        });

    });
});
