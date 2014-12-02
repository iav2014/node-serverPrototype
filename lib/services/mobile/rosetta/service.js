/*
 This is an example of service.
 this service translate a post message parameter using google translator a message from  (language) to (language)
 using ISO639-1 codes
 google translator facility.
 */
var logger = require('../../../../lib/logger/logger').logger(__filename);
var validator = require('../../../utils/validator');
var schema = require('../../../schemas/mobile/rosetta');
var methods = require('../../../commons/methods');
var config = require('../../../../config/config');
var iso639_1 = require('../../../../json/iso639-1.json');

var async = require ('async');
var request = require('request');
/*
if you need to use mongodb pool connector you must include this lines
var mongoPool = require('../../../connectors/mongodb_pool');
var mongoUri = mongoPool.getUri(config.databases.test);
example with languages collection :  mongoPool.get(mongoUri).find(config.collections.languages,function (err, result) { .. });
 */
function getPostData(post,callback){
  var postObj = {
    from: post.from,
    to: post.to,
    message:post.message
  }
  callback(null,postObj);
}
function checkSchema(postObj,callback){
  methods.validateRegister(postObj,schema, function(err,result){
    logger.debug('in:'+JSON.stringify(result));
    var errorMsg;
    if(!err.valid){
      logger.error(JSON.stringify(err));
      callback(true,err);
    }
    else {
      if (iso639_1[postObj.from] === undefined) {
        errorMsg = {error:'invalid [from] field',languages:iso639_1};
        callback(true,errorMsg);
      }
      else {
        if (iso639_1[postObj.to] === undefined) {
          errorMsg = {error:'invalid [to] field',languages:iso639_1};
          callback(true,errorMsg);
        } else{
          callback(null,result);
        }
      }
    }
  });
}
function translate(postObj,callback){
  googleTranslator(postObj.message,postObj.from,postObj.to,function(err,result){
      if(err) callback(err);
      else callback(null,result);
    })
}
function googleTranslator(msg,from,to,callback){
  request('http://translate.google.com/translate_a/t?client=t&text='+msg+'&hl='+from+'&sl='+from+'&tl='+to+'&ie=UTF-8&oe=UTF-8&multires=1&otf=1&ssel=3&tsel=3&sc=1'
    , function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(null,body.substring(4,body.indexOf('","')))
      }
    })
}
function worker(post,callback){
  var async = require ('async');
  async.waterfall([
      async.apply(getPostData,post),
      checkSchema,
      translate
     ],
    function (err, result) {
      if(err) callback(result)
      else callback(err,{source:post.message,target:result});
    }
  );
}
function entry(post, callback) {
  async.parallelLimit( [async.apply(worker,post)],config.rest.max_callers, function(err,result) {
    if(err) logger.error('out:'+JSON.stringify(err));
    else logger.debug('out:'+JSON.stringify(result[0]));
    callback(err,result[0]);
  });
}
module.exports.entry = entry;

