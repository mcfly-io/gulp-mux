'use strict';

var mux = require('../../lib/mux.js');
var _ = require('lodash');

describe('mux', function() {
    beforeEach(function() {
        this.constants = require('./asset/constants.js');
        this.add = function(a, b) {
            return a + b;
        };
    });

    describe('resolveConstants()', function() {
        beforeEach(function() {
            this.templateData = {
                targetName: 'web',
                targetSuffix: '-web',
                mode: 'prod'
            };
        });

        it('with valid arguments should succeed', function() {
            var ret = mux.resolveConstants(this.constants, this.templateData);
            assert.deepEqual(ret.targetName, this.templateData.targetName);
            assert.deepEqual(ret.targetSuffix, this.templateData.targetSuffix);
            assert.deepEqual(ret.mode, this.templateData.mode);
        });

        it('should correctly return bool ', function() {
            var ret = mux.resolveConstants(this.constants, this.templateData);
            assert.ok(_.isBoolean(ret.boolValue));
            assert.deepEqual(ret.boolValue, true);
        });

        it('should correctly return float', function() {
            var ret = mux.resolveConstants(this.constants, this.templateData);
            assert.deepEqual(ret.floatValue, 3.5);
        });

        it('should correctly return array', function() {
            var ret = mux.resolveConstants(this.constants, this.templateData);
            assert.ok(_.isArray(ret.arrayValue));
            assert.deepEqual(ret.arrayValue, [this.templateData.targetName, this.templateData.targetName]);
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

    describe('createSingleFn()', function() {

        beforeEach(function() {

        });

        it('with valid arguments should succeed', function() {
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

    describe('createTasks()', function() {
        beforeEach(function() {
            this.gulp = require('gulp');
            this.copy = function(constants) {
                return constants;
            };
            this.targets = ['app', 'mobile', 'web'];
            this.mode = 'prod';
        });

        it('with valid arguments should succeed', function() {

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

    describe('createAndRunTasks()', function() {
        beforeEach(function() {
            this.gulp = require('gulp');
            this.copy = sinon.spy(function(constants) {
                return constants;
            });
            this.targets = ['app', 'mobile', 'web'];
            this.mode = 'prod';
        });

        it('with valid arguments should succeed', function() {
            var cb = sinon.spy();
            mux.createAndRunTasks(this.gulp, this.copy, 'copy', this.targets, this.mode, this.constants, cb);
            assert(this.copy.called);
            assert.equal(this.copy.callCount, 3);
            assert(cb.called);
            assert(this.copy.getCall(0).returnValue.targetName = this.targets[0]);
            assert(this.copy.getCall(1).returnValue.targetName = this.targets[1]);
            assert(this.copy.getCall(2).returnValue.targetName = this.targets[2]);

        });

    });

    describe('sanitizeWatchFolders()', function() {

        it('with an array should succeed', function() {
            var folders = ['./client/dummy/file1.js', './client/dummy/file2.js', 'client/dummy/file3.js'];
            var expectedFolders = ['client/dummy/file1.js', 'client/dummy/file2.js', 'client/dummy/file3.js'];
            var sanitizeFolders = mux.sanitizeWatchFolders(folders);
            assert.deepEqual(sanitizeFolders, expectedFolders);
        });

        it('with a string should succeed', function() {
            var folder = './client/dummy/file1.js';
            var expectedFolder = 'client/dummy/file1.js';
            var sanitizeFolder = mux.sanitizeWatchFolders(folder);
            assert.equal(sanitizeFolder, expectedFolder);
        });

        it('with a null should return null', function() {
            var expectedFolder = null;
            var sanitizeFolder = mux.sanitizeWatchFolders(null);
            assert.equal(sanitizeFolder, expectedFolder);
        });
    });
});