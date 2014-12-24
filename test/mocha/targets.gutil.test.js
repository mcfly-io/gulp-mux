'use strict';

var mockery = require('mockery');
var testHelper = require('./testHelper')();
var targets;
var chalk = require('chalk');
var clientFolder = './test/mocha/asset';

describe('askFor() properly logs', function() {
    var gutil = testHelper.gutilMock;
    before(function() {
        testHelper.endMock(mockery);
        // Register mocks here
        mockery.registerMock('gulp-util', gutil);
        // End of mocks
        testHelper.startMock(mockery);
        targets = require('../../lib/targets');
        targets.setClientFolder(clientFolder);
    });

    after(function() {
        testHelper.endMock(mockery);
    });

    it('should output all used options', function() {
        var expectedMessage = 'Running task \'' + chalk.cyan('multiple') + '\' with targets ' + chalk.yellow('app,mobile,web') + ' in mode ' + chalk.yellow('dev');
        targets.askForMultipleTargets('multiple');
        assert(gutil.log.calledWith(expectedMessage));
        //done();
    });
});
