angular.module('cplantApp').factory('proposalService', ['$http', '$q', function ($http, $q) {
  'use strict';

  function list(skip = 0, limit = 50) {
    return $http.get('api/proposal', {
      params: {
        skip: skip,
        limit: limit
      }
    }).then(function (res) {
      if (res.data.err) {
        return $q.reject(res.data.msg);
      }
      return res.data;
    });
  }

  function all() {
    return $http.get('api/proposal/all')
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function get(id) {
    return $http.get('api/proposal/id/' + id)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }


  function create(proposal) {
    return $http.post('api/proposal', proposal)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function remove(id) {
    return $http.delete('api/proposal/id/' + id)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function update(proposal) {
    return $http.put('api/proposal/id/' + proposal._id, proposal)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  return {
    list,
    all,
    get,
    create,
    remove,
    update,
  };
}]);
