'use strict';
var _ = require('lodash');
_.mixin(require('lodash-deep'));

/**
 * Resolve the passed constants object with the target
 * @param {Object} constants - The constants object
 * @param {String} target - The target to replace in the constants object
 *
 * @returns {Object} - The resolved constants object
 */
exports.resolveConstants = function(constants, target) {
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