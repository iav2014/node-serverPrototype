var logger = require('../logger/logger').logger(__filename);
var mongoConnector = require('../connectors/mongodb_connector');
var config = require('../../config/config');
function mongodbLoader(callback) {
  var mC = new mongoConnector(logger,
    config.database_policy.retry,
    config.databases.test);
  mC.init(function (err) {
    if (err)
      callback(err);
    else
      logger.info('Connected to mongo database: ' + JSON.stringify(config.databases.fidiliti));
    callback();
  });
}
module.exports.mongodbLoader = mongodbLoader;