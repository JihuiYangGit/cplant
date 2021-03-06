'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({

  app: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },
  },

  summary: {
    type: String,
    required: true
  },

  desc: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['BUG', 'FEATURE']
  },

  status: {
    type: String,
    enum: ['NEW', 'ACCEPTED', 'REJECTED'],
    default: 'NEW'
  },

  rejectReason: {
    type: String,
    enum: ['NOT A BUG','DUPLICATED','CANNOT FIX ','OTHER',''],
    default: ''
  },

  trelloCardId: String,
  trelloCardUrl: String,

  lab: {
    id: String,
    name: String,
    labId: String
  },

  // Kerberos Id
  userId: String,

  attachments: {
    type: Array
  }
}, {
  // Mongoose will assign createdAt and updatedAt fields to the Schema and handle them.
  timestamps: true
});

reportSchema.statics = {
  get: function (id) {
    return this.findById(id)
      .exec()
      .then(function (user) {
        if (user) {
          return user;
        }
        const err = new Error('No Such Report');
        return Promise.reject(err);
      });
  },

  list: function (userId, skip = 0, limit = 50) {
    skip = skip || 0;
    limit = limit || 50;
    return this.find(userId ? {userId: userId} : null)
      .sort({createAt: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  all: function (userId) {
    return this.find(userId ? {userId: userId} : null)
      .sort({createAt: -1})
      .exec();
  }
};


module.exports = mongoose.model('Report', reportSchema);
