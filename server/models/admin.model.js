'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AdminSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  kerberosid: {
    type: String,
    required: true
  },

  email: {
    type: String,
  },

  role: {
    type: String,
    default: 'admin'
  }
});

AdminSchema.statics = {
  all: function (userId) {
    return this.find(userId ? {userId: userId} : null)
      .sort({name: 1})
      .exec();
  }
};

module.exports = mongoose.model('Admin', AdminSchema);
