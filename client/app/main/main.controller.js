angular.module('cplantApp').controller('mainCtrl', ['$mdDialog', 'proposalService', 'reportService', 'labsService', function ($mdDialog, proposalService, reportService, labsService) {
  'use strict';
  var self = this;

  var query = {
    order: 'updatedAt',
    page: 1,
    limit: 10,
    cond: {}
  };

  function showFellowList() {
    self.requests.length = 0;
  // .slice((query.page - 1) * query.limit, query.page * query.limit)
    self._requests.filter(value => {
      for (var q in query.cond) {
        if (query.cond.hasOwnProperty(q)) {
          if (value[q] && value[q] !== query.cond[q]) {
            return false;
          }
        }
      }
      return true;
    }).forEach((value, index) => {
      self.requests.push(value);
    });
  }

  function addToFellowList(data) {
    self._requests = self._requests
      .concat(data)
      .sort(function (a, b) {
        var c = new Date(a.createAt);
        var d = new Date(b.createAt);

        return c - d;
      })
      .reduce(function (a, b) {
        if (a.length === 0 || a.slice(-1)[0]._id !== b._id) {
          a.push(b);
        }
        return a;
      }, []);
  }


  function getSummary() {
    proposalService.all().then(function (data) {
      self._requests = data;
      showFellowList();
    });
    reportService.all().then(function (data) {
      addToFellowList(data);
      showFellowList();
    });

  }


  self._requests = [];
  self.requests = [];
  self.showFellowList = showFellowList;

  self.showProposal = function () {
    query.cond.type = 'PROPOSAL';
    showFellowList();
  };

  self.showFeature = function () {
    query.cond.type = 'FEATURE';
    showFellowList();
  };

  self.showBug = function () {
    query.cond.type = 'BUG';
    showFellowList();
  };

  self.reset = function () {
    query.cond = {};

    showFellowList();
  };

  self.logPagination = function (page, limit) {
    query.page = page;
    query.limit = limit;
 //   showFellowList();
  };

  self.detail = function (f, ev) {
    if (f.type === 'PROPOSAL') {
      $mdDialog.show({
        controller: 'appDetailCtrl',
        templateUrl: 'app/nomination/proposal/app-detail.html',
        parent: angular.element('body'),
        locals:{proposal:f},
        bindToController:true,
        controllerAs: 'appDetailCtrl',
        targetEvent: ev,
      });
    } else {
      $mdDialog.show({
        controller: 'reportDetailCtrl',
        templateUrl: 'app/nomination/report/' + (f.type === 'BUG' ? 'bug-detail.html' : 'feature-detail.html'),
        parent: angular.element('body'),
        locals: {report: f},
        bindToController: true,
        controllerAs: 'reportDetailCtrl',
        targetEvent: ev
      });
    }
  };

  self.query = query;

  getSummary();
}]);
