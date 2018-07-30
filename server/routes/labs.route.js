'use strict';

const express = require('express');
const apps = require('./labs-app');
const pkg = require('../../package');

const trelloCtrl = require('../controllers/trello.controller');
const proposalCtrl = require('../controllers/proposal.controller');
const reportCtrl = require('../controllers/report.controller');


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

router.route('/trello/proposal/:proposalId')
  .post(trelloCtrl.createProposalTrello);

router.route('/trello/report/:reportId')
  .post(trelloCtrl.createReportTrello);

router.param('proposalId', proposalCtrl.load);
router.param('reportId', reportCtrl.load);

module.exports = router;
