angular.module('cplantApp').controller('reportDetailCtrl', ['$mdDialog', '$mdToast', 'reportService', 'labsService', function ($mdDialog, $mdToast, reportService, labsService) {
  'use strict';
  var self = this;

  self.report = self.locals.report;

  self.isAdmin = function() {
    return labsService.isAdmin();
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.accept = function() {
    labsService.createTrello(self.report);
    self.cancel();
  };


  self.reject = function() {
    self.report.status = 'REJECTED';
    reportService.update(self.report)
      .then(function () {
        $mdToast.showSimple('Success!');
      });
    self.cancel();
  };


  self.isCompletedAccept = function() {
    return self.report.status === 'ACCEPTED';
  };

  self.isCompletedReject = function() {
    return self.report.status === 'REJECTED';
  };

  self.edit = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      templateUrl: 'app/nomination/report/' + (self.report.type === 'FEATURE' ? 'feature' : 'bug') + '-form.html',
      parent: angular.element('body'),
      locals: {report: self.report},
      bindToController: true,
      controllerAs: 'newReportCtrl',
      targetEvent: ev,
    }).then(function (data) {
      var report = data[0];
      var attachments = data[1];
      reportService.update(report, attachments)
        .then(function () {
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]);
