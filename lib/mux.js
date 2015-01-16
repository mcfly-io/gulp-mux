/**
 * @module gulp-mux
 */

'use strict';
var _ = require('lodash');
_.mixin(require('lodash-deep'));
var randomstring = require('randomstring');
var runSequence = require('run-sequence');
var targets = require('./targets');

/**
 * Create a function pointer attached to the arguments provided
 * accept besides fn, an optional list of arguments following the signature of fn
 * @method createSingleFn
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

/**
 * Create an array of function pointers, attached one each to the arguments
 * provided in args, and array of single arguments or arrays for the function pointers.
 * @method createArrayFn
 * @param {Function} fn - The function the pointer should point to
 * @param {Array} args - The array of arguments-or-arrays to be bound to the pointers
 *
 * @returns {Function[]} - The array of function pointers
 */
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
        throw new Error('args must be an array of arrays');
    }
    args.forEach(function(arg) {
        fns.push(createSingleFn(fn, arg));
    });
    return fns;
};

/**
 * Resolve the passed constants object with the target
 * @method resolveConstants
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
        targetSuffix: '',
        mode: ''
    };
    // we clone the object to avoid touching the original
    var clone = _.cloneDeep(constants);
    return _(clone)
        .deepMapValues(function(value) {
            if(!_.isString(value)) {
                return value;
            } else {
                return _.template(value, templateObj, {
                    'interpolate': /{{([\s\S]+?)}}/g
                });
            }
        })
        .value();
};

var targetToSuffix = targets.targetToSuffix;

var targetToTemplateData = function(target, mode) {
    return {
        targetName: target,
        targetSuffix: targetToSuffix(target),
        mode: mode
    };
};

/**
 * Create gulp tasks from the provided function for the desired targets and the
 * mode as specified and using the provided constants template.
 * @method createTasks
 * @param {Object} gulp - The instance of gulp to use for the muxed tasks
 * @param {Function} fn - The function with the operations to be run based on the provided constants
 * @param {String} taskname - The name of the underlying task that fn performs
 * @param {String|String[]} targets - An array of target names or the single target for the created task(s)
 * @param {String} mode - the desired mode, either 'dev' or 'prod'
 * @param {Object} constants - The constants object
 *
 * @returns {String[]} - The array of created tasks
 */
var createTasks = exports.createTasks = function(gulp, fn, taskname, targets, mode, constants) {
    if(!fn) {
        throw new Error('The passed fn cannot be null or undefined');
    }
    var tasks = [];

    taskname = taskname || '';
    targets = [].concat(targets);
    targets.forEach(function(target, index) {
        var targetConstants = resolveConstants(constants, targetToTemplateData(target, mode));
        var fulltaskname = taskname.length === 0 ? randomstring.generate(5) : taskname + ':' + randomstring.generate(5);
        gulp.task(fulltaskname, createSingleFn(fn, targetConstants));
        tasks.push(fulltaskname);
    });
    return tasks;
};

/**
 * Runs all of the of gulp tasks provided in parallel
 * @method runTasks
 * @param {Object} gulp - The instance of gulp to use for the muxed tasks
 * @param {String[]} tasks - The tasks to run as an array of tasknames
 * @param {Function} cb - The callback to to run-sequence run after all tasks are complete.
 *
 * @returns {*} - Returns the returns of any of the subtasks, so chaining works.
 */
var runTasks = exports.runTasks = function(gulp, tasks, cb) {
    var runSeq = runSequence.use(gulp);

    return runSeq(tasks, function() {
        //tasks.forEach(function(task) {
        //    gulp.seq = _(gulp.seq).remove(task).value();
        //    delete gulp.tasks[task];
        //});
        if(cb) {
            cb();
        }
    });
};

/**
 * Composes the {@link createTask} and {@link runTask} functions
 * @method createAndRunTasks
 * @param {Object} gulp - The instance of gulp to use for the muxed tasks
 * @param {Function} fn - The function with the operations to be run based on the provided constants
 * @param {String} taskname - The name of the underlying task that fn performs
 * @param {String|String[]} targets - An array of target names or the single target for the created task(s)
 * @param {String} mode - the desired mode, either 'dev' or 'prod'
 * @param {Object} constants - The constants object
 * @param {Function} cb - The callback to to run-sequence run after all tasks are complete.
 *
 * @returns {*} - Returns the returns of any of the subtasks, so chaining works.
 */
var createAndRunTasks = exports.createAndRunTasks = function(gulp, fn, taskname, targets, mode, constants, cb) {
    var tasks = createTasks(gulp, fn, taskname, targets, mode, constants);
    return runTasks(gulp, tasks, cb);
};
