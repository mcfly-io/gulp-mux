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

    it('#resolveConstants() should succeed', function() {
        var ret = mux.resolveConstants(this.constants, {targetName: 'web', targetSuffix: '-web'});
        assert.deepEqual(ret.style.sass.src, ['./' + clientFolder + '/styles/main-web.scss']);
    });

    it('#resolveConstants() with constants null should return null', function() {
        var ret = mux.resolveConstants(null);
        assert.equal(ret, null);
    });

    it('#resolveConstants() with constants undefined should return null', function() {
        var ret = mux.resolveConstants(undefined);
        assert.equal(ret, null);
    });

    it('#resolveConstants() with target null should return original constants', function() {
        var ret = mux.resolveConstants(this.constants);
        assert.deepEqual(ret.style.sass.src, ['./' + clientFolder + '/styles/main.scss']);
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

});
