'use strict';

const path = require('path');
const _ = require('lodash');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// All configurations will extend these options
// ============================================
const all = {

  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // MongoDB connection options
  mongo: {
    options: {
      // db: {
      //   safe: true
      // }
    }
  },

  whitelist: [
    'rhn-support-dzhao',
    'yuzhao@redhat.com'
  ]

};

// Setting auth domains for non prod environments
const ns = process.env.OPENSHIFT_NAMESPACE;
if (!ns || ns !== 'labsprod') {
  process.env.COOKIE_AUTH_DOMAIN = 'https://access.devgssci.devlab.phx1.redhat.com';
  process.env.COOKIE_AUTH_URL = 'https://access.devgssci.devlab.phx1.redhat.com/services/user/status?jsoncallback=';
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
