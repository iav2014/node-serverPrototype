var crypto = require('crypto');

module.exports = {
  md5: function (data) {
    'use strict';
    return crypto.createHash('md5').update(data).digest('hex');
  },
  randomString: function (len) {
    'use strict';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = len; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }
}

