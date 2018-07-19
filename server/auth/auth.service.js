'use strict';

var jwt = require('jsonwebtoken');

var logger = require('../logger');

function AuthService() { }

AuthService.prototype.getUser = function (req) {
    if (!req.cookies.rh_jwt) {
        logger.error('No jwt found!');
        return;
    }

    var info = jwt.decode(req.cookies.rh_jwt);
    if (!info) {
        logger.error('Failed to decode jwt!');
        return;
    }

    var isInternal = false;
    if (info.realm_access && info.realm_access.roles) {
        var roles = info.realm_access.roles;
        for (var i in roles) {
            if (roles[i] === 'redhat:employees') {
                isInternal = true;
                break;
            }
        }
    }
    return {
        sso_username: info.username,
        first_name: info.firstName,
        last_name: info.lastName,
        account_number: info.account_number,
        email: info.email,
        is_internal: isInternal
    };
};

module.exports = new AuthService();
//
// var LdapAuth = require('ldapauth-fork');
// var Q = require('q');
// var Token = require('./api/token/token.model');
//
// var username = '';
// var password = '';
//
// var getCA = function () {
//   var dfd = Q.defer();
//   Token.findOne({
//     env: 'RH_IT_CA'
//   }, function (err, token) {
//     if (err) {
//       console.log(err);
//       dfd.resolve({ result: false, msg: err });
//     }
//     dfd.resolve(token.token);
//   });
//   return dfd.promise;
// };
//
// var verify = function (ca) {
//   var dfd = Q.defer();
//   var options = {
//     url: 'ldaps://ldap.corp.redhat.com:636',
//     searchBase: 'ou=users,dc=redhat,dc=com',
//     searchFilter: '(uid={{username}})',
//     tlsOptions: { ca: new Buffer(ca, 'base64').toString('ascii') }
//   };
//   var auth = new LdapAuth(options);
//   auth.on('error', function (err) {
//     console.error('LdapAuth: ', err);
//     dfd.resolve({ result: false, msg: err.toString() });
//   });
//   auth.authenticate(username, password, function (err, user) {
//     auth.close();
//     if (err) {
//       console.log('LDAP auth error: %s', err);
//       dfd.resolve({ result: false, msg: err.toString() });
//     } else {
//       dfd.resolve({ result: true, msg: username });
//     }
//   });
//   return dfd.promise;
// };
//
// exports.login = function (id, passwd) {
//   var dfd = Q.defer();
//   username = id;
//   password = passwd;
//   getCA()
//     .then(verify)
//     .then(function (result) {
//       console.log(result);
//       dfd.resolve(result);
//     });
//   return dfd.promise;
// };
