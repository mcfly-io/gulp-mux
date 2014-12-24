'use strict';

module.exports = function() {
    var gutilMock = {
        log: require('sinon').spy()
    };

    var endMock = function(mockery) {
        mockery.disable();
        mockery.deregisterAll();
    };

    var startMock = function(mockery) {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });
    };

    return {
        gutilMock: gutilMock,
        startMock: startMock,
        endMock: endMock
    };
};
