var request = require('request');
var server = require('../../../../lib/backend');
var should = require('should');
var config = require('../../../../config/config');

var url = 'http://localhost:' + config.app.http + '/ws3/';
var timeout = 10000;

describe('#E2E rosetta, server start  ', function () {
  before(function (done) {
    this.timeout(timeout);
    if(!server.active()) server.start();
    setTimeout(function () {
      done();
    }, 5000);
  });
  it('#rosetta display all greetings', function (done) {
    this.timeout(timeout);
    var register = {"from":"en","to":"es","message":"hello world!"};
    var options = {
      uri:url+'hello',
      json:register
    };
    request.post(options, function (err, result) {
      should.not.exists(err);
      if (err) {
        done(err);
      }
      else {
        should.exists(result.body.source);
        should.exists(result.body.target);
        done();
      }
    });
  });

  it('#rosetta  error, name field is mandatory !', function (done) {
    this.timeout(timeout);
    var register = {"from":"en","message":"hello world!"};
    var options = {
      uri:url+'hello',
      json:register
    };
    request.post(options, function (err, result) {
      should.not.exists(err);
      if (err) {
        done(err);
      }
      else {
        should.exists(result.body.valid);
        result.body.valid.should.be.equal(false);
        done();
      }
    });
  });
});

