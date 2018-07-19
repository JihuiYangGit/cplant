angular.module('cplantApp').controller('reportDetailCtrl', ['$mdDialog', '$mdToast', 'reportService', function ($mdDialog, $mdToast, reportService) {
  'use strict';
  var self = this;

  self.report = self.locals.report;


  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
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
