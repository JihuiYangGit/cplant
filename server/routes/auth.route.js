const path = require('path');
const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/environment/index');
const labsRoutes = require('./labs.route');
const router = express.Router();

router.post('/auth', authCtrl.auth);

router.get('/', function (req, res, next) {
    'use strict';
    res.sendFile(path.resolve(config.publicDir + '/index.html'));
});


module.exports = router;
