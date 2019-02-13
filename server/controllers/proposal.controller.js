'use strict';

const Proposal = require('../models/proposal.model');


function load(req, res, next, id) {
  Proposal.get(id)
    .then(function(proposal) {
      if(!req.session.admin && req.session.auth !== proposal.userId) {
        return next(new Error('Unauthorized request'));
      }

      req.proposal = proposal;
      return next();
    })
    .catch(function(err) {return next(err);});
}

function get(req, res) {
  return res.json(req.proposal);
}


function create(req, res, next) {
  var proposal = new Proposal(req.body);
  proposal.userId = req.session.auth;

  proposal.save()
    .then(function(savedProposal){return res.json(savedProposal);})
    .catch(function(err){return next(err);});
}

function update(req, res, next) {
  var proposal = req.proposal;

  Object.keys(req.body)
    .forEach(function(key) {return proposal[key] = req.body[key]; });

  proposal.save()
    .then(function(savedProposal){return res.json(savedProposal); })
    .catch(function(err){return next(err); });
}

function list(req, res, next) {
  let session = req.session;

  let skip = req.query.skip || 0;
  let limit = req.query.limit || 50;

  Proposal.list(session.admin?null:session.auth, skip, limit)
    .then(function(proposals) {return res.json(proposals);} )
    .catch(function(err) {return next(err);});

}


function all(req, res, next) {
  let session = req.session;

  Proposal.all(session.admin?null:session.auth)
    .then(function(proposals) {
      res.json(proposals);
    })
    .catch(function(err){next(err)});
}

function remove(req, res, next) {
  let proposal = req.proposal;
  proposal.remove()
    .then(function(deletedProposal){return res.json(deletedProposal)})
    .catch(function(err) {return next(err)} );
}

function mailto(req,res,next) {
  var address = req.body.address; 
  var subject = req.body.subject;
  var text = req.body.text;
  //var status = req.body.status;
  
  console.log('address: ' + address);
  console.log('subject: ' + subject);
  console.log('text: ' + text);
  var nodemailer = require('nodemailer');

  var mailTransport = nodemailer.createTransport({
      service: 'Gmail',
      port: '465',
      secureConnection: true,
      auth : {
          user : 'jihyang@redhat.com',
          pass : 'xgwubjgkgwdejqui'
      },
  });

  var mailOptions = {
    from: 'jihyang@redhat.com',
    to: address,
    subject: subject,
    text: text
  };

  mailTransport.sendMail(mailOptions)
  .then(function(mailOptions){
    return res.json(mailOptions);
  })
  .catch(function(err){
    return next(err);
  })
}


module.exports = {
  load, get, create, update, list, all, remove, mailto
};


