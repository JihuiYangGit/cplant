angular.module('cplantApp').controller('reportDetailCtrl', ['$mdDialog', '$mdToast', 'reportService', 'labsService', function ($mdDialog, $mdToast, reportService, labsService) {
  'use strict';
  var self = this;

  self.report = self.locals.report;
  self.reportStatus = self.report.status;
  console.log(self.reportStatus);
  self.startProgress = false;
  self.disableConfirm = false;
  self.rejectReason = '';
  self.reasons = ['NOT A BUG','DUPLICATED','CANNOT FIX ','OTHER'];

  self.isAdmin = function () {
    return labsService.isAdmin();
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  function accept() {
    self.disableConfirm = true;
    labsService
      .createTrello(self.report)
      .then(function (data) {
        self.report.status = 'ACCEPTED';
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();
        if(data.result) {
          self.report.trelloCardId = data.trelloCardId;
          self.report.trelloCardUrl = data.trelloCardUrl;
        }
      }, function (data) {
        $mdToast.showSimple('Failed!' + data);
        self.disableConfirm = false;
      });
  }


  function reject() {
    var originStatus = self.report.status;
    self.disableConfirm = true;
    self.report.status = 'REJECTED';
    self.report.rejectReason = self.rejectReason;
    reportService.update(self.report)
      .then(function () {
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();
      }, function (data) {
        $mdToast.showSimple('Failed!' + data);
        self.disableConfirm = false;
        self.report.status = originStatus;
      });
  }

  function recover() {
    self.disableConfirm = true;
    self.report.status = 'NEW';
    reportService.update(self.report)
      .then(function () {
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();
      }, function (data) {
        $mdToast.showSimple('Failed!' + data);
        self.disableConfirm = false;
      });
  }


  self.updateStatus = function () {
    self.disableConfirm = true;
    if (self.reportStatus === self.report.status) {
      return;
    }
    self.startProgress = true;
    if (!self.report.trelloCardId) {
      if (self.reportStatus === 'REJECTED') {
        reject();
      } else if (self.reportStatus === 'ACCEPTED') {
        accept();
      } else {
        recover();
      }
    } else {
      var originStatus = self.report.status;
      self.report.status = self.reportStatus;
      labsService.updateTrello(self.report)
        .then(function () {
          self.report.status = self.reportStatus;
          self.report.rejectReason = self.rejectReason;
          self.startProgress = false;
          $mdToast.showSimple('Success!');
          self.cancel();
        }, function () {
          self.disableConfirm = false;
          self.report.status = originStatus;
        });
    }
  };

  self.edit = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      templateUrl: 'app/main/nomination/report/' + (self.report.type === 'FEATURE' ? 'feature' : 'bug') + '-form.html',
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

  self.isCompletedAccept = function () {
    return self.report.status === 'ACCEPTED';
  };
}]);
