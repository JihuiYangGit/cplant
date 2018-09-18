'use strict';
const path = require('path');
const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/environment/index');

const router = express.Router();

router.post('/auth', authCtrl.auth);

router.get('/', function (req, res, next) {
  res.sendFile(path.resolve(config.publicDir + '/app/login/login.html'));
  //res.sendFile(path.resolve(config.publicDir + '/app/login/bow.json'));
});


module.exports = router;
