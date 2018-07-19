angular.module('cplantApp').controller('newBugCtrl', ['$mdDialog', '$mdToast', 'reportService', function ($mdDialog, $mdToast, reportService) {
  'use strict';
  var self = this;

  self.create = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      contentElement: '#newBugDialog',
      parent: angular.element('body'),
      targetEvent: ev,
      clickOutsideToClose: false,
    }).then(function (data) {
      var report = data[0];
      var attachments = data[1];
      report.type = 'BUG';
      reportService.create(report, attachments)
        .then(function () {
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]).controller('newFeatureCtrl', ['$mdDialog', '$mdToast', 'reportService', function ($mdDialog, $mdToast, reportService) {
  'use strict';
  var self = this;


  self.create = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      contentElement: '#newFeatureDialog',
      parent: angular.element('body'),
      targetEvent: ev,
      clickOutsideToClose: false,
    }).then(function (data) {
      var report = data[0];
      var attachments = data[1];
      report.type = 'FEATURE';
      reportService.create(report, attachments)
        .then(function () {
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]).controller('newReportCtrl', ['$mdDialog', 'labsService', function ($mdDialog, labsService) {
  'use strict';
  var self = this;

  self.apps = [];

  labsService.all().then(function (data) {
    self.apps = data;
  });

  function init() {
    self.selectedApp = null;
    self.searchText = '';

    if(self.locals && self.locals.report) {
      self.report = self.locals.report;
    } else {
      self.report = {
        app: null,
        summary: '',
        desc: '',
      };
    }

    self.files = [];
  }

  init();

  self.querySearch = function (query) {
    query = query || '';
    query = query.toLowerCase();

    return query ? self.apps.filter(function (item) {
      return item && (item.name.toLowerCase().indexOf(query) !== -1 || item.id.toLowerCase().indexOf(query) !== -1);
    }) : self.apps;

  };

  self.removeUploadFile = function (f) {
    if (!self.files) {
      return;
    }

    var index = self.files.indexOf(f);
    if (index !== -1) {
      self.files.splice(index, 1);
    }
  };

  self.removeAttachment = function (f) {
    if (!self.report.attachments) {
      return;
    }

    var index = self.report.attachments.indexOf(f);
    if (index !== -1) {
      self.report.attachments.splice(index, 1);
    }
  };

  self.uploadFileNumber = function () {
    return self.files ? self.files.length : 0;
  };

  self.attachmentsNumber = function () {
    return self.report.attachments ? self.report.attachments.length : 0;
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (reportForm) {
    if (reportForm.$valid) {
      $mdDialog.hide([self.report, self.files]).then(function () {
        self.reset(reportForm);
      });
    }
  };

  self.reset = function (reportForm) {
    reportForm.$setPristine();
    init();
  };
}]);
