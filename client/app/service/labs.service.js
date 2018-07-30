angular.module('cplantApp').factory('labsService', ['$http', '$cookies','$q', function ($http, $cookies, $q) {
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

  // TODO Pass data by cookie is a bad implementation, should be fix in the future.
  function getUser() {
    return $cookies.get('red-hat-cplant-user');
  }

  function isAdmin() {
    return !!$cookies.get('redhat-red-hat-cplant-admin');
  }
  
  function signOut() {
    window.location.href = 'api/labs/signOut';
  }

  return {
    all,
    getUser,
    isAdmin,
    signOut,
  };
}]);
