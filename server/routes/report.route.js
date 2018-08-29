'use strict';

const express = require('express');
const multer = require('multer');
const config = require('../config/environment');

const reportCtrl = require('../controllers/report.controller');


var storage = multer.diskStorage({
  destination: config.publicDir + '/uploads/',

  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage: storage, limits: {files: 5, fileSize: 1024 * 1024}});


const router = express.Router();

router.route('/')
  .get(reportCtrl.list)
  .post(upload.array('files', 5), reportCtrl.create);

router.route('/id/:reportId')
  .get(reportCtrl.get)
  .put(upload.array('files', 5), reportCtrl.update)
  .delete(reportCtrl.remove);

router.route('/all')
  .get(reportCtrl.all);

router.param('reportId', reportCtrl.load);


module.exports = router;



