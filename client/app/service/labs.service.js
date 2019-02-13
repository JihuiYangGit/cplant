angular.module('cplantApp').factory('labsService', ['$http', '$cookies', '$q', function ($http, $cookies, $q) {
  'use strict';
  var apps = null;

  function all() {
    return $http({
      method : 'GET',
      url: 'api/labs/labinfo',
    })
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        if (apps) {
          return $q.resolve(apps);
        }
        apps = res.data;

        return apps;
      });
  }

  // TODO pass data by cookie is a bad implementation, should to be fix in the future.
  function getUser() {
    return $cookies.get('red-hat-cplant-user');
  }

  function isAdmin() {
    return !!$cookies.get('red-hat-cplant-admin');
  }

  function signOut() {
     window.location.href = 'api/labs/signOut';
  }

  function createTrello(nomination) {
    if (nomination.type === 'PROPOSAL') {
      return $http.post('api/labs/trello/proposal/' + nomination._id)
        .then(function (res) {
          if (res.data.err) {
            return $q.reject(res.data.msg);
          }
          return res.data;
        });
    } else if (nomination.type === 'BUG' || nomination.type === 'FEATURE') {
      return $http.post('api/labs/trello/report/' + nomination._id)
        .then(function (res) {
          if (res.data.err) {
            return $q.reject(res.data.msg);
          }
          return res.data;
        });
    }
  }

  function updateTrello(nomination) {
    if (nomination.type === 'PROPOSAL') {
      return $http.put('api/labs/trello/proposal/' + nomination._id, {newStatus: nomination.status})
        .then(function (res) {
          if (res.data.err) {
            return $q.reject(res.data.msg);
          }
          return res.data;
        });
    } else if (nomination.type === 'BUG' || nomination.type === 'FEATURE') {
      return $http.put('api/labs/trello/report/' + nomination._id, {newStatus: nomination.status})
        .then(function (res) {
          if (res.data.err) {
            return $q.reject(res.data.msg);
          }
          return res.data;
        });
    }
  }

  function addAdmin(admin) {
    var kerberosEmail = admin.kerberosid + '@redhat.com';
    admin.email = admin.email ? admin.email : kerberosEmail;
    return $http.post('api/labs/addAdmin',admin)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function listAdmin() {
    return $http.get('api/labs/listAdmin')
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  return {
    all: all,
    getUser: getUser,
    isAdmin: isAdmin,
    signOut: signOut,
    createTrello: createTrello,
    updateTrello: updateTrello,
    addAdmin: addAdmin,
    listAdmin: listAdmin
  };
}]);
