/*
this middleware only display request body before calling route
 */
var logger = require('../logger/logger').logger(__filename);
function requestBodyParams(req, res, next) {
  logger.warn('post:'+JSON.stringify(req.body));
  next();
};
module.exports.requestBodyParams = requestBodyParams;

