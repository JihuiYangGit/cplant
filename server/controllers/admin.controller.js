'use strict';

const Admin = require('../models/admin.model');

function addAdmin(req, res, next) {
  let admin = new Admin(req.body);
  admin.userId = req.session.auth;
  admin.save()
    .then(function(savedAdmin) {return res.json(savedAdmin)} )
    .catch(function(err){return next(err)} );
}

function listAdmin(req, res, next) {
    let session = req.session;
  
    Admin.all(session.admin?null:session.auth)
      .then(function(admins){return res.json(admins)} )
      .catch(function(err){return next(err)});
  }
  

module.exports = {
    addAdmin, listAdmin
};


