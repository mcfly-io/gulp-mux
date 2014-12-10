'use strict';

var maths = require('../../lib/maths.js');

describe('maths', function() {
    beforeEach(function() {

    });

    it('#add() should succeed', function() {
        var ret = maths.add(12, 13);
        assert.equal(ret, 25);
    });

    it('#sub() should succeed', function() {
        var ret = maths.sub(12, 13);
        assert.equal(ret, -1);
    });
});