'use strict';

const path = require('path');
const http = require('http');

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const moment = require('moment');
const mongoose = require('mongoose');

const pkg = require('../package');
const routes = require('./routes/index.route');
const auth = require('./auth/auth.route');
// contains all configuration
const config = require('./config/environment');

const app = express();
const appPath = '/labs/' + pkg.name + '/';

if (config.env !== 'production') {
  app.use(appPath, express.static(path.resolve('.tmp')));
}

app.use(session({
  secret: 'customer portal labs',
  resave: false,
  cookie: {}
}));

// connect to mongodb database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(appPath + 'login', function (req, res, next) {
  if(req.session.auth) {
    return res.redirect(appPath);
  }
  next();
}, auth);


app.use(function (req, res, next) {
  if(!req.session.auth) {
    return res.redirect(appPath + 'login');
  }
  next();
});

app.use(appPath + 'api', routes);

app.use(appPath, express.static(path.resolve(config.publicDir)));

app.get('/', function (req, res) {
  res.send(200);
});

app.get(appPath + '*', function (req, res) {
  res.sendFile(path.resolve(config.publicDir + '/index.html'));
});

// handle error
app.use(function (err, req, res, next) {
  res.json({
    err: true,
    mes: err.message
  });
});

// Start server
http.createServer(app).listen(config.port, config.ip, function () {
  console.log(moment().format() + ' Express server listening on %d, in %s mode', config.port, app.get('env'));
});
