angular.module('cplantApp').factory('reportService', ['$http', '$q', 'Upload', function ($http, $q, Upload) {
  'use strict';

  function list(skip = 0, limit = 50) {
    return $http.get('api/report', {
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
    return $http.get('api/report/all')
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function get(id) {
    return $http.get('api/report/id/' + id)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }


  function create(report, attachments) {
    return Upload.upload({
      url: 'api/report',
      data: {
        report: report,
        files: attachments
      },
      arrayKey: ''
    });
  }

  function remove(id) {
    return $http.delete('api/report/id/' + id)
      .then(function (res) {
        if (res.data.err) {
          return $q.reject(res.data.msg);
        }
        return res.data;
      });
  }

  function update(report, attachments) {
    return Upload.upload({
      url: 'api/report/id/' + report._id,
      data: {
        report: report,
        files: attachments
      },
      arrayKey: '',
      method: 'put'
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
