'use strict';

var index = require('../../index.js');

describe('index', function() {
    beforeEach(function() {

    });

    it('should exports maths', function() {
        assert.equal(typeof index.maths, 'object');
    });

    it('should exports maths.add', function() {
        assert.equal(typeof index.maths.add, 'function');
    });
});