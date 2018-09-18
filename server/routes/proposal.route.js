const express = require('express');
const proposalCtrl = require('../controllers/proposal.controller');

const router = express.Router();

router.route('/')
  .get(proposalCtrl.list)
  .post(proposalCtrl.create);

router.route('/mail')
  .post(proposalCtrl.mailto);

router.route('/id/:proposalId')
  .get(proposalCtrl.get)
  .put(proposalCtrl.update)
  .delete(proposalCtrl.remove);

router.route('/all')
  .get(proposalCtrl.all);

router.param('proposalId', proposalCtrl.load);

module.exports = router;


