var Mongo = require('mongodb');
var retry = 1, config;
var mongoPool = require('./mongodb_pool');
var log, policy;
function MongoConnector(logger, retrying, dbConfig) {
  log = logger;
  policy = retry = retrying;
  config = dbConfig;
  this.client = null;
}
MongoConnector.prototype = {
  init: function (callback) {
    'use strict';
    var self = this;
    if (retry-- < 0) return callback(new Error().statusCode = -1, null);
    var url = 'mongodb://' + ((config.user) ? config.user + ':' + config.password : '') + '@' + config.host + ':' +
      config.port + '/' + config.database;
    Mongo.connect(url, function (err, db) {
      if (err) {
        log.error(err);
        return self.init(callback);
      }
      else {
        self.client = db;
        retry = config.retry;
        mongoPool.set(url, self);
        callback(null, db);
      }
      db.on('close', function () {
        log.error('Close event received at:' + JSON.stringify(config));
        mongoPool.remove(url);
        retry = policy;
        return self.init(callback);
      });
    });
  },
  findOne: function (collectionName, data, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.findOne(data, function (err, result) {
      callback(err, result);
    });
  },
  find: function (collectionName, data, options, callback) {
    'use strict';
    if (typeof  options == 'function') {
      callback = options;
      options = {};
    }
    var collection = this.client.collection(collectionName);
    collection.find(data, options).toArray(function (err, result) {
      if (err) callback(err);
      else callback(null, [].slice.call(result));
    });
  },
  insert: function (collectionName, data, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.insert(data, function (err, result) {
      callback(err, result);
    });
  },
  count: function (collectionName, callback) {
    'use strict';
    this.client.collection(collectionName, function (err, coll) {
      coll.find({}, {}).count(function (err, count) {
        callback(err, count);
      });
    });
  },
  new: function (collectionName, callback) {
    'use strict';
    var options = {
      'limit': -1,
      'sort': {id: -1}
    }
    this.client.collection(collectionName, function (err, coll) {
      coll.find({}, options).toArray(function (err, count) {
        callback(err, count[0].id);
      });
    });
  },
  recno: function (collectionName, callback) {
    'use strict';
    this.client.collection(collectionName, function (err, coll) {
      coll.count(function (err,count){
        callback(null,count);
      })
    });
  },
  update: function (collectionName, query, data, options, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.update(query, data, options, function (err, result) {
      callback(err, result);
    });
  },
  remove: function (collectionName, query, data, options, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.remove(query, data, options, function (err, result) {
      callback(err, result);
    });
  },
  delete: function (collectionName, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.remove({},function(err,result){
      callback(err,result);
    });
  },
  findAndUpdate: function (collectionName, query, data, callback) {
    'use strict';
    var collection = this.client.collection(collectionName);
    collection.update(query, data, function (err, result) {
      callback(err, result);
    });
  }
}
module.exports = MongoConnector;









