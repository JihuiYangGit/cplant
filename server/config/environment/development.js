'use strict';

// Development specific configuration
// ==================================
module.exports = {

  publicDir: 'client',

  ip: process.env.IP || 'localhost',

  port: process.env.PORT || 9000,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/cplant-development'
  },
};
