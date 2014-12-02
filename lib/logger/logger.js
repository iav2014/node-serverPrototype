var log4js = require('log4js');
var util = require('util');
var moment = require('moment');
var config = require('../../config/config');
var stackTrace = require('stack-trace');
log4js.configure(config.logger);
var logger = log4js.getLogger();
module.exports.logger = function (operationCode) {
  'use strict';
  var customLogger = {};
  ['debug', 'info', 'warn', 'error', 'fatal', 'express'].forEach(
    function (levelString) {
      customLogger[levelString] = function (message) {
        var frame, line,column, method;
        frame = stackTrace.get()[1];
        line = frame.getLineNumber();
        column = frame.getColumnNumber();
        method = frame.getFunctionName();
        method===null?method='anonymous':method=method;
        var  operation;
        operation = operationCode ? operationCode : 'NA';
        var formatedMessage = util.format('%s|[%s(%s,%s)]|[%s]|%s',
           process.pid,method,line,column,operation, message);
        if (levelString === 'express') {
          return moment().format('YYYY-MM-DDThh:mm:ssZZ') + '|EXPRESS|' + formatedMessage;
        }
        logger[levelString](formatedMessage);
      };
    });
  return customLogger;
};



