'use strict';

var mux = require('../../lib/mux.js');

describe('mux', function() {
    var clientFolder = 'www';

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
            var ret = mux.resolveConstants(this.constants, {
                targetName: 'web',
                targetSuffix: '-web'
            });
            assert.deepEqual(ret.style.sass.src, ['./' + clientFolder + '/styles/main-web.scss']);
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
            assert.deepEqual(ret.style.sass.src, ['./' + clientFolder + '/styles/main.scss']);
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
            var gulp = this.gulp = sinon.spy();
            gulp.tasks = [];
            gulp.task = function(name, fn) {
                gulp.tasks.push({
                    name: name,
                    fn: fn
                });
            };

            this.gulp = require('gulp');
            this.copy = function(constants) {
                return constants;
            };
            this.targets = [{
                targetName: 'web',
                targetSuffix: '-web'
            }, {
                targetName: 'mobile',
                targetSuffix: '-mobile'
            }];
        });

        it('should succeed', function() {

            var tasks = mux.createTasks(this.gulp, this.copy, 'copy', this.targets, this.constants);
            assert.lengthOf(tasks, 2);
            assert.deepEqual(this.gulp.tasks[tasks[0]].fn(), mux.resolveConstants(this.constants, this.targets[0]));
            assert.deepEqual(this.gulp.tasks[tasks[1]].fn(), mux.resolveConstants(this.constants, this.targets[1]));

        });

        it('with no name should succeed', function() {

            var tasks = mux.createTasks(this.gulp, this.copy, null, this.targets, this.constants);
            assert.lengthOf(tasks, 2);
            assert.deepEqual(this.gulp.tasks[tasks[0]].fn(), mux.resolveConstants(this.constants, this.targets[0]));
            assert.deepEqual(this.gulp.tasks[tasks[1]].fn(), mux.resolveConstants(this.constants, this.targets[1]));

        });

        it('with null fn should throw Error', function() {
            assert.throws(function() {
                mux.createTasks(this.gulp, null, 'copy', this.targets, this.constants);
            }.bind(this), Error);

        });

    });
});