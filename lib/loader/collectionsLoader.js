var logger = require('../logger/logger').logger(__filename);
var config = require('../../config/config');
var mongoPool = require('../connectors/mongodb_pool');
var mongoUri = mongoPool.getUri(config.databases.test);
var iso639 = require('../../json/iso639-1.json');
function collectionsLoader(callback) {
  logger.info('collections loader, creating mongodb collections [languages]');
  dropAndCreateLanguages(iso639,function(err,result){
    if(err) callback(err);
    else
    {
      callback();
    }
  })
}
function dropAndCreateLanguages(data,callback){
  mongoPool.get(mongoUri).delete(config.collections.languages,function (err, result) {
    if(err) {
      logger.error(err);
      callback();
    } else {
      mongoPool.get(mongoUri).insert(config.collections.languages, data, function (err, result) {
        if(err) {
          logger.error(err);
          callback();
        } else  callback();
      });
    }
  });
}

module.exports.collectionsLoader = collectionsLoader;
