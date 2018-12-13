/*global require, console */

var path = require('path');
var http = require('http');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var moment = require('moment');
var mongoose = require('mongoose');

var pkg = require('../package');
var routes = require('./routes/index.route');
var auth = require('./routes/auth.route');
// contains all configuration
var config = require('./config/environment');

var app = express();
var appPath = '/labs/' + pkg.name + '/';

if (config.env !== 'production') {
    app.use(appPath, express.static(path.resolve('.tmp')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'customer portal labs',
    resave: false,
    cookie: {},
    saveUninitialized: true
}));

// connect to mongodb database
  mongoose.Promise = global.Promise
  console.log('uri:' + config.mongo.uri);
  mongoose.connect(config.mongo.uri,config.mongo.options)
  .then(function(){return console.log('MongoDB Connected');})
  .catch(function(err){return console.log(err);});

app.use(appPath + 'bower_components/', express.static(path.resolve(config.publicDir + '/bower_components')));
app.use(appPath + 'assets/', express.static(path.resolve(config.publicDir + '/assets')));

app.use(function (req, res, next) {
    'use strict';
    //CORS config
    res.header('Access-Control-Allow-Origin', '');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    } else {
        next();
    }
});

/*app.use(appPath + 'login', function (req, res, next) {
  if (req.session.auth) {
    return res.redirect(appPath);
  }
  next();
}, auth);


app.use(function (req, res, next) {
  if (!req.session.auth) {
    return res.redirect(appPath + 'login');
  }
  next();
});*/

app.use(appPath, express.static(path.resolve(config.publicDir)));

app.use(appPath + 'api', routes);

app.get('/', function (req, res) {
    'use strict';
    res.send(200);
});

app.get(appPath + '*', function (req, res) {
    'use strict';
    res.sendFile(path.resolve(config.publicDir + '/index.html'));
});

// handle error
app.use(function (err, req, res, next) {
    'use strict';
    res.json({
        err: true,
        mes: err.message
    });
});

// Start server
http.createServer(app).listen(config.port, config.ip, function () {
    'use strict';
    console.log(moment().format() + ' Express server listening on %d, in %s mode', config.port, app.get('env'));
});
