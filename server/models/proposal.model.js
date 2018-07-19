'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProposalSchema = new Schema({
  name: {
    type: String,
    required: true
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
    default: 'PROPOSAL'
  },

  requiredQuestions: {

    // The Red Hat product will this tool help with.
    product: {
      type: String,
      required: true
    },


    // The SBR this tool belong to
    sbr: {
      type: String,
      required: true
    },
    // Who will use this tool
    targetUser: {
      type: Array,
      required: true
    },

    // What are your key requirements or features about this tool?
    keyDesc: {
      type: String,
      required: true
    },

    // Please list scenarios as many as possible in which the tool will be used.
    scenarios: {
      type: String,
      required: true
    },

    // Is there any specific reason to request this lab, e.g. a request from your customer? If yes, please elaborate more about it.
    specialReason: {
      type: String,
      required: true
    },

    // Who will be the primary contact that the labs dev team can reach out to during development?(Please provide their email addresses separated by commas.)
    contacts: {
      type: Array,
      required: true
    }
  },

  optionalQuestions: {
    // How many potential users would this tool have? (Please do your best guess if you don't have an exact number.)
    expectUsers: String,

    // The number of cases that were opened in the last 30 days related to the problem that the tool targets
    caseFrequency: String,

    // Can this tool help decrease case volume? If yes, how many cases this tool would help resolve in a month approximately?
    expectCaseDecreasing: String,

    // Can this tool help shorten case TTC(time to close)? If yes, what is the percentage of time can be saved approximately?
    expectTTCDecreasing: String,

    // Are there any tools existing in communities or Red Hat providing similar features?
    similarTools: String,

    // What KBase solutions or documents are related to this tool? (Please provide links to them)
    relatedKBaseRes: String,
  },


  status: {
    type: String,
    enum: ['NEW', 'ACCEPTED', 'REJECTED'],
    default: 'NEW'
  },

  // TODO Add other field for user to track status in Trello
  trello: {
    id: String,
  },

  user: {
    sso_username: String, // jshint ignore:line
    first_name: String, // jshint ignore:line
    last_name: String, // jshint ignore:line
    account_number: String, // jshint ignore:line
    email: String, // jshint ignore:line
    is_internal: Boolean // jshint ignore:line
  }
}, {
  // Mongoose will assign createdAt and updatedAt fields to the Schema and handle them.
  timestamps: true
});

ProposalSchema.statics = {
  get: function (id) {
    return this.findById(id)
      .exec()
      .then(function (user) {
        if (user) {
          return user;
        }
        const err = new Error('No Such Proposal');
        return Promise.reject(err);
      });
  },

  list: function (skip = 0, limit = 50) {
    return this.find()
      .sort({createdAt: -1})
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  all: function () {
    return this.find()
      .sort({createdAt: -1})
      .exec();
  }
};


module.exports = mongoose.model('Proposal', ProposalSchema);
