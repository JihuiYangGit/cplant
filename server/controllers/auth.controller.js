'use strict';
const auth = require('../auth');
const Admin = require('../models/admin.model');
const pkg = require('../../package');
const appPath = '/labs/' + pkg.name + '/';

// default max age set to 10 minutes
const DEFAULT_MAX_AGE = 10 * 60 * 1000;

let userInfo = '';
exports.auth = function (req, res) {
  auth.login(req.body.kerberosid, req.body.password).then(function (result) {
    if (result.result === false) {
      userInfo = {result: false, msg: 'login failed'};
      return res.send(userInfo);
    }
    Admin.findOne({
      kerberosid: req.body.kerberosid
    }, function (err, user) {
      if (err) {
        userInfo = {result: false, msg: err};
        return res.send(userInfo);
      }

      if (user) {
        req.session.admin = true;
        req.session.maxAge = 3 * DEFAULT_MAX_AGE;
        res.cookie('red-hat-cplant-admin', 'true');
      } else {
        req.session.maxAge = DEFAULT_MAX_AGE;
      }
      req.session.auth = result.msg;
      res.cookie('red-hat-cplant-user', result.msg);

      return res.send(result);
    });
  });
};

