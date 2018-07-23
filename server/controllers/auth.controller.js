'use strict';
const auth = require('../auth');
const Admin = require('../auth/admin.model');
const pkg = require('../../package');
const appPath = '/labs/' + pkg.name + '/';


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
      }
      req.session.auth = true;
      return res.redirect(appPath);
    });
  });
};
