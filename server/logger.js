'use strict';
var tracer = require('tracer');
var daily = tracer.dailyfile({
    format: '{{message}}',
    root: process.env.APP_LOG_HOME
});
var color = tracer.colorConsole({
    format: '{{message}}'
});
var levels = ['log', 'trace', 'debug', 'info', 'warn', 'error'];

module.exports = tracer.console({
    transport: function (data) {
        var level = levels[data.level];
        color[level](data.output);
        daily[level](data.output);
    }
});
