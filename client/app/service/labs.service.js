angular.module('cplantApp').factory('labsService', ['$http', '$q', function ($http, $q) {
  'use strict';

  var apps = null;

  function all() {
    return $http.get('api/labs/all')
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }

        if(apps) {
          return $q.resolve(apps);
        }

        apps = res.data;
        return apps;
      });
  }

  function getUser() {

  }

  function isAdmin() {
    return false  ;
  }

  return {
    all,
    isAdmin
  };
}]);
