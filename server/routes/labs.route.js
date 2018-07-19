'use strict';

const express = require('express');
const apps = require('./labs-app');

const router = express.Router();

router.route('/all')
  .get(function (eq, res) {
    res.json(apps);
  });

module.exports = router;
