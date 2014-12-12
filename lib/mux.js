'use strict';
var _ = require('lodash');
_.mixin(require('lodash-deep'));
var randomstring = require('randomstring');
var runSequence = require('run-sequence');

var DEFAULT_TARGET = 'app';

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

    if(!_.isFunction(fn)) {
        throw new Error('fn must be a function');
    }

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
 * @param {Object} templateObj - The object of target names and file suffixes for a target to replace in the constants object
 *
 * @returns {Object} - The resolved constants object
 */
var resolveConstants = exports.resolveConstants = function(constants, templateObj) {
    if(constants === null || constants === undefined) {
        return null;
    }

    templateObj = templateObj || {
        targetName: '',
        targetSuffix: ''
    };
    // we clone the object to avoid touching the original
    var clone = _.cloneDeep(constants);
    return _(clone)
        .deepMapValues(function(value) {
            return _.template(value, templateObj, {
                'interpolate': /{{([\s\S]+?)}}/g
            });
        })
        .value();
};

var targetToSuffix = function(target) {
    return target === DEFAULT_TARGET ? '' : '-' + target;
};

var targetToTemplateData = function(target) {
    return {
        targetName: target,
        targetSuffix: targetToSuffix(target)
    };
};

var createTasks = exports.createTasks = function(gulp, fn, taskname, targets, constants) {
    if(!fn) {
        throw new Error('The passed fn cannot be null or undefined');
    }
    var tasks = [];

    taskname = taskname || '';

    targets.forEach(function(target, index) {
        var targetConstants = resolveConstants(constants, targetToTemplateData(target));
        var fulltaskname = taskname.length === 0 ? randomstring.generate(5) : taskname + ':' + randomstring.generate(5);
        //gulp.task(fulltaskname, false, fn.bind(gulp, targetConstants));
        gulp.task(fulltaskname, createSingleFn(fn, targetConstants));
        tasks.push(fulltaskname);
    });
    return tasks;
};

var runTasks = exports.runTasks = function(gulp, tasks, cb) {
    var runSeq = runSequence.use(gulp);

    return runSeq(tasks, function() {
        tasks.forEach(function(task) {
            gulp.seq = _(gulp.seq).remove(task).value();
            delete gulp.tasks[task];
        });
        if(cb) {
            cb();
        }
    });
};

var createAndRunTasks = exports.createAndRunTasks = function(gulp, fn, taskname, targets, constants, cb) {
    var tasks = createTasks(gulp, fn, taskname, targets, constants);
    return runTasks(gulp, tasks, cb);
};