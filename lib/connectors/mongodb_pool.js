var pool = [];
function getPoolConnector(db) {
  if (!db) return null;
  for (var i = 0; i < pool.length; i++) {
    if (pool[i].url === db) return pool[i].connector;
  }
  return null;
}
function setPoolConnector(db, con) {
  pool.push({url: db, connector: con});
}
function getPoolLength() {
  return pool.length;
}
function removePoolConnector(db) {
  if (!db) return null;
  for (var i = 0; i < pool.length; i++) {
    if (pool[i].url == db) {
      pool.splice(i, 1);
      return i;
    }
  }
  return null;
}
function getUri(config) {
  return ('mongodb://' + ((config.user) ? config.user + ':' + config.password : '') + '@' + config.host + ':' +
    config.port + '/' + config.database);
}
module.exports.get = getPoolConnector;
module.exports.set = setPoolConnector;
module.exports.remove = removePoolConnector;
module.exports.getLength = getPoolLength;
module.exports.getUri = getUri;

