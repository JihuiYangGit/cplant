'use strict';
const express = require('express');

const proposalRoutes = require('./proposal.route');
const reportRoutes = require('./report.route');
const labsRoutes = require('./labs.route');

const router = express.Router();

router.use('/proposal', proposalRoutes);
router.use('/labs', labsRoutes);
router.use('/report', reportRoutes);


module.exports = router;
