'use strict';
var LdapAuth = require('ldapauth-fork');
var Q = require('q');

var username = '';
var password = '';


var verify = function () {
  var dfd = Q.defer();
  var options = {
    url: 'ldaps://ldap.corp.redhat.com:636',
    searchBase: 'ou=users,dc=redhat,dc=com',
    searchFilter: '(uid={{username}})',
  };
  var auth = new LdapAuth(options);
  auth.on('error', function (err) {
    console.error('LdapAuth: ', err);
    dfd.resolve({ result: false, msg: err.toString() });
  });
  auth.authenticate(username, password, function (err, user) {
    auth.close();
    if (err) {
      console.log("LDAP auth error: %s", err);
      dfd.resolve({ result: false, msg: err.toString() });
    } else {
      dfd.resolve({ result: true, msg: username });
    }
  });
  return dfd.promise;
};

exports.login = function (id, passwd) {
  var dfd = Q.defer();
  username = id;
  password = passwd;
  verify()
    .then(function (result) {
      console.log(result);
      dfd.resolve(result);
    });
  return dfd.promise;
};
