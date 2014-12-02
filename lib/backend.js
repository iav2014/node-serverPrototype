/*
  Nacho Ariza 2014
  backend framework prototype.Can be scaling yourself with more routes and services.
  This backend is based on the concepts of ROUTES and SERVICES and use a mongo pool connector, and loader for static context.
  It is structured in layers to obtain decouple code (clear code).
  There are two forms of execution, in single mode and cluster mode.
  backend.sh shell script can be used.
  backend.sh start / stop / restart / status  or
  node single.js or node cluster.js
  config file defined http/
  Example of call:
  http://localhost:4000/ws3/hello
  https://localhost:3443/ws3/hello
  POST method
  x-www-form-urlencoded
  parameters:
  languaje en or es  (english os spanish internationalization messages)
  name required (any data)
 */
var fs = require('fs');
var util = require('util');
var cluster = require('cluster');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mobileRoutes = require('./routes/mobile/loadingRoutes');
var collectionsLoader = require('./loader/collectionsLoader'); // static context, countries
var mongoLoader = require('./loader/mongo'); // mongodb connector pool
var router = express.Router();
var app = express();
var https = require('https');
var http = require('http');
var async = require('async');
var config = require('./../config/config'); // config file
var logger = require('./logger/logger').logger(__filename);
var log4js = require('log4js');
var theAppLog = log4js.getLogger();
var middleware = require('./middleware/requestBody');
var theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
  'stream': {
    write: function (str) {
      theAppLog.debug(str);
    }
  }
});
var started = false;
function start() {
  var key = fs.readFileSync('./cert/server.key'); // your server.key && pem files
  var cert = fs.readFileSync('./cert/server.pem')
  var https_options = {
    key: key,
    cert: cert
  };
  logger.info('Starting server, please wait...');
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json({limit: '5mb'}));
  app.use('/', router);
  app.use(theHTTPLog);
  app.use(methodOverride());
  app.use(express.static(process.cwd() + '/public')); // for public contents
  app.use(middleware.requestBodyParams);
  mobileRoutes.register(app);
  https.createServer(https_options, app).listen(config.app.https);
  http.createServer(app).listen(config.app.http);
  app.listen(config.app.port, config.app.host, function () {
    async.series([mongoLoader.mongodbLoader,collectionsLoader.collectionsLoader],
      function (err) {
      if (err) {
        logger.error(util.format('Something went wrong in booting time (%s)', err));
        process.exit(1);
      } else {
        logger.info('Server started at ports [' + config.app.http + ','+ config.app.https+']');
        started = true;
      }
    });
  });
}

function startInCluster() {
  if (!cluster.isMaster) {
    start();
  }
  else {
    var threads = require('os').cpus().length;
    while (threads--) cluster.fork();
    cluster.on('death', function (worker) {
      cluster.fork();
      logger.info('Process died and restarted, pid:', worker.pid);
    });
  }
}
function active() {
  return started;
}
function stop() {
  process.exit(0);
}

exports.start = start;
exports.startInCluster = startInCluster;
exports.active = active;
exports.stop = stop;
