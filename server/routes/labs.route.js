'use strict';

const express = require('express');
// const apps = require('./labs-app');
const pkg = require('../../package');

const trelloCtrl = require('../controllers/trello.controller');
const proposalCtrl = require('../controllers/proposal.controller');
const reportCtrl = require('../controllers/report.controller');
const adminCtrl = require('../controllers/admin.controller');

const router = express.Router();

const appPath = '/labs/' + pkg.name + '/';

router.route('/signOut')
  .get(function (req, res, next) {
    req.session.auth=null;
    req.session.admin=null;
    res.clearCookie('red-hat-cplant-user');
    res.clearCookie('red-hat-cplant-admin');
    return res.redirect(appPath + 'login');
  });

router.route('/labinfo')
  .get(reportCtrl.getLabsApp);

router.route('/trello/proposal/:proposalId')
  .post(trelloCtrl.createProposalTrello)
  .put(trelloCtrl.updateProposalTrello);

router.route('/trello/report/:reportId')
  .post(trelloCtrl.createReportTrello)
  .put(trelloCtrl.updateReportTrello);

router.route('/addAdmin')
  .post(adminCtrl.addAdmin);

router.route('/listAdmin')
  .get(adminCtrl.listAdmin);

router.param('proposalId', proposalCtrl.load);
router.param('reportId', reportCtrl.load);

module.exports = router;
