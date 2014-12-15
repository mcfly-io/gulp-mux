'use strict';

var path = require('path');

// externally required parameters
var cwd = process.env.INIT_CWD || '';
var clientFolder = 'www';
var BASE_TARGET_NAME = 'app';

// static (untemplated) parameters
module.exports = {
    cwd: cwd,

    clientFolder: clientFolder,
    targetName: '{{targetName}}',
    targetSuffix: '{{targetSuffix}}',
    mode: '{{mode}}',

    boolValue: true,
    floatValue: 3.5,
    arrayValue: ['{{targetName}}', '{{targetName}}']
};
