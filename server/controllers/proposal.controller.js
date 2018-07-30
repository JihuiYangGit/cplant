'use strict';

const Proposal = require('../models/proposal.model');


function load(req, res, next, id) {
  Proposal.get(id)
    .then(proposal => {
      if(!req.session.admin && req.session.auth !== proposal.userId) {
        return next(new Error('Unauthorized request'));
      }

      req.proposal = proposal;
      return next();
    })
    .catch(err => next(err));
}

function get(req, res) {
  return res.json(req.proposal);
}


function create(req, res, next) {
  let proposal = new Proposal(req.body);
  proposal.userId = req.session.auth;

  proposal.save()
    .then(savedProposal => res.json(savedProposal))
    .catch(err => next(err));
}

function update(req, res, next) {
  let proposal = req.proposal;

  Object.keys(req.body)
    .forEach(key => proposal[key] = req.body[key]);

  proposal.save()
    .then(savedProposal => res.json(savedProposal))
    .catch(err => next(err));
}

function list(req, res, next) {
  let session = req.session;

  let skip = req.query.skip || 0;
  let limit = req.query.limit || 50;

  Proposal.list(session.admin?null:session.auth, skip, limit)
    .then(proposals => res.json(proposals))
    .catch(err => next(err));

}


function all(req, res, next) {
  let session = req.session;

  Proposal.all(session.admin?null:session.auth)
    .then(proposals => {
      res.json(proposals);
    })
    .catch(err => next(err));
}

function remove(req, res, next) {
  let proposal = req.proposal;
  proposal.remove()
    .then(deletedProposal => res.json(deletedProposal))
    .catch(err => next(err));
}


module.exports = {
  load, get, create, update, list, all, remove
};


