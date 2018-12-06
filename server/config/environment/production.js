'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  'localhost',

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  9000,

  // public directory
  publicDir: process.env.OPENSHIFT_LABSNODEJS_IP ? 'public' : 'dist/public',


 
  //MongoDB connection options
  mongo: {
    uri: 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST1 + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + ','+ process.env.OPENSHIFT_MONGODB_DB_HOST2 + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + ','+ process.env.OPENSHIFT_MONGODB_DB_HOST3 + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME ,
    options: {
      poolSize: 10,
      ssl: true,
      sslValidate: true,
      sslCA: [require('fs').readFileSync(process.env.CPLABS_DB_CERT_PATH)],
      keepAlive: true,
      useMongoClient: true,
      socketTimeoutMS: 0,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      replicaSet: 'cplabsmongo',
      authSource: 'admin'
    }
  }
};
