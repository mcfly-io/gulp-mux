/**
 * @module gulp-mux
 */

'use strict';
var _ = require('lodash');
var randomstring = require('randomstring');
var runSequence = require('run-sequence');
var targets = require('./targets');

var changeObject = function(object, cb) {
    _.each(object, function(value, key) {
        if (_.isObject(value)) {
            changeObject(value, cb);
        } else {
            if (!_.isString(value)) {
                object[key] = value;
            } else {
                object[key] = cb(value);
            }
        }
    });
};

/**
 * Create a function pointer attached to the arguments provided
 * accept besides fn, an optional list of arguments following the signature of fn
 * @method createSingleFn
 * @param {Function} fn - The function the pointer should point to
 *
 * @returns {Function} - The pointer
 */
var createSingleFn = function(fn) {
    //var args = Array.prototype.slice.call(arguments, 0);
    //assert.ok(_.isFunction(fn), 'fn must be a function');
    if (!_.isFunction(fn)) {
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
var createArrayFn = function(fn, args) {
    var fns = [];

    if (!_.isFunction(fn)) {
        throw new Error('fn must be a function');
    }

    if (!args) {
        fns.push(createSingleFn(fn));
        return fns;
    }
    if (!_.isArray(args)) {
        throw new Error('args must be an array of arrays');
    }
    args.forEach(function(arg) {
        fns.push(createSingleFn(fn, arg));
    });
    return fns;
};

// jscs:disable
/**
 * Resolve the passed constants object with the target
 * @method resolveConstants
 * @param {Object} constants - The constants object
 * @param {Object} templateObj - The object of target names and file suffixes for a target to replace in the constants object
 * @returns {Object} - The resolved constants object
 */
var resolveConstants = function(constants, templateObj) {
    if (constants === null || constants === undefined) {
        return null;
    }

    templateObj = templateObj || {
        targetName: '',
        targetSuffix: '',
        mode: ''
    };
    // we clone the object to avoid touching the original
    var clone = _.cloneDeep(constants);
    changeObject(clone, function(value) {
        var compiled = _.template(value, {
            'interpolate': /{{([\s\S]+?)}}/g
        });
        return compiled(templateObj);
    });
    return clone;
};

var targetToSuffix = targets.targetToSuffix;

var targetToTemplateData = function(target, mode) {
    return {
        targetName: target,
        targetSuffix: targetToSuffix(target),
        mode: mode
    };
};
// jscs:enable

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
var createTasks = function(gulp, fn, taskname, targets, mode, constants) {
    if (!fn) {
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
var runTasks = function(gulp, tasks, cb) {
    var runSeq = runSequence.use(gulp);

    return runSeq(tasks, function() {
        //tasks.forEach(function(task) {
        //    gulp.seq = _(gulp.seq).remove(task).value();
        //    delete gulp.tasks[task];
        //});
        if (cb) {
            cb();
        }
    });
};

var runTasksSequential = function(gulp, tasks, cb) {
    var runSeq = runSequence.use(gulp);
    if (cb) {
        tasks.push(cb);
    }
    return runSeq.apply(this, tasks);
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
var createAndRunTasks = function(gulp, fn, taskname, targets, mode, constants, cb) {
    var tasks = createTasks(gulp, fn, taskname, targets, mode, constants);
    return runTasks(gulp, tasks, cb);
};

var createAndRunTasksSequential = function(gulp, fn, taskname, targets, mode, constants, cb) {
    var tasks = createTasks(gulp, fn, taskname, targets, mode, constants);
    return runTasksSequential(gulp, tasks, cb);
};

/**
 * Sanitize a list of watchable folders removing './' from the path as it generates a bug that makes the gulp.watch miss changes on new or deleted files
 * @param  {Array|string} folders - An array of folders or a single folder
 *
 * @returns {Array|string} - Returns the adjusted list of folders or single folder.
 */
var sanitizeWatchFolders = function(folders) {
    var sanitizeFolder = function(folder) {
        if (folder.indexOf('./') === 0) {
            return folder.substring(2);
        } else {
            return folder;
        }
    };

    if (!folders) {
        return folders;
    }
    if (!_.isArray(folders)) {
        return sanitizeFolder(folders);
    }

    return _(folders)
        .map(sanitizeFolder)
        .value();
};

module.exports = {
    createSingleFn: createSingleFn,
    createArrayFn: createArrayFn,
    resolveConstants: resolveConstants,
    createTasks: createTasks,
    runTasks: runTasks,
    runTasksSequential: runTasksSequential,
    createAndRunTasks: createAndRunTasks,
    createAndRunTasksSequential: createAndRunTasksSequential,
    sanitizeWatchFolders: sanitizeWatchFolders
};