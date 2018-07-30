'use strict';

const express = require('express');
const apps = require('./labs-app');
const pkg = require('../../package');

const router = express.Router();

const appPath = '/labs/' + pkg.name + '/';

router.route('/all')
  .get(function (req, res) {
    res.json(apps);
  });

router.route('/signOut')
  .get(function (req, res, next) {
    req.session.auth=null;
    req.session.admin=null;
    res.clearCookie('red-hat-cplant-user');
    res.clearCookie('redhat-red-hat-cplant-admin');

    return res.redirect(appPath + 'login');
  });

module.exports = router;
