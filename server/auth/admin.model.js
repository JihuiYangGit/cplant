'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AdminSchema = new Schema({
  name: String,
  kerberosid: String,
  email: String,
  role: String
});

module.exports = mongoose.model('Admin', AdminSchema);
