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
var authRoute = require('./routes/auth.route');
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
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options).then(function (db) {
    'use strict';
    var Admin = db.collection('admins');
    Admin.update(
        {kerberosid:'jihyang'},
        {
            name:'Yang Jihui',
            kerberosid:'jihyang',
            email:'jihyang@redhat.com',
            role:'admin'
         },
         {upsert: true}
    );
    return console.log('MongoDB Connected');
}).catch(function (err) {
    'use strict';
    return console.log(err);
});

app.use(appPath, express.static(path.resolve(config.publicDir)));

app.use(appPath + 'login', function (req, res, next) {
    if ((req.session.auth) || (req.headers.cookie.indexOf('red-hat-cplant-admin') !== -1)) {
        return res.redirect(appPath);
    }
    next();
}, authRoute);

app.use(function (req, res, next) {
    if ((!req.session.auth) && (req.headers.cookie.indexOf('red-hat-cplant-admin') === -1)) {
        return res.redirect(appPath + 'login');
    }
    next();
});

app.use(appPath + 'api', routes);

app.get('/', function (req, res) {
    'use strict';
    res.sendStatus(200);
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
