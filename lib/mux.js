'use strict';
var _ = require('lodash');
_.mixin(require('lodash-deep'));
var randomstring = require('randomstring');
var assert = require('assert');
var getTargets = require('./targets');

/**
 * Create a function pointer attached to the arguments provided
 * accept besides fn, an optional list of arguments following the signature of fn
 * @param {Function} fn - The function the pointer should point to
 *
 * @returns {Function} - The pointer
 */
var createSingleFn = exports.createSingleFn = function(fn) {
    //var args = Array.prototype.slice.call(arguments, 0);
    //assert.ok(_.isFunction(fn), 'fn must be a function');
    if(!_.isFunction(fn)) {
        throw new Error('fn must be a function');
    }
    return Function.bind.apply(fn, _(arguments).flatten().value());
};

var createArrayFn = exports.createArrayFn = function(fn, args) {
    var fns = [];
    if(!args) {
        fns.push(createSingleFn(fn));
        return fns;
    }
    if(!_.isArray(args)) {
        throw new Error('args must be an array of array');
    }
    args.forEach(function(arg) {
        fns.push(createSingleFn(fn, arg));
    });
    return fns;
};

/**
 * Resolve the passed constants object with the target
 * @param {Object} constants - The constants object
 * @param {String} target - The target to replace in the constants object
 *
 * @returns {Object} - The resolved constants object
 */
var resolveConstants = exports.resolveConstants = function(constants, target) {
    if(constants === null || constants === undefined) {
        return null;
    }
    // we clone the object to avoid touching the original
    var clone = _.cloneDeep(constants);
    return _(clone)
        .deepMapValues(function(value) {
            return _.template(value, {
                target: target
            });
        })
        .value();
};

var createTasks = exports.createTasks = function(gulp, fn, taskname, targets, constants) {
    if(!fn) {
        throw new Error('The passed fn cannot be null or undefined');
    }
    targets = targets || getTargets();
    var tasks = [];
    targets.forEach(function(target, index) {
        var targetConstants = resolveConstants(constants, target);
        var fulltaskname = taskname.length > 0 ? randomstring.generate(5) : +':' + randomstring.generate(5);
        //gulp.task(fulltaskname, false, fn.bind(gulp, targetConstants));
        gulp.task(fulltaskname, createSingleFn(fn, targetConstants));
        tasks.push(fulltaskname);
    });
    return tasks;
};