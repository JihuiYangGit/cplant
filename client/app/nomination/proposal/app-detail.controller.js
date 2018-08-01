angular.module('cplantApp').controller('appDetailCtrl', ['$mdDialog', '$mdToast', 'proposalService', 'labsService', function ($mdDialog, $mdToast, proposalService, labsService) {
  'use strict';
  var self = this;
  self.proposal = self.locals.proposal;
  self.proposalStatus = self.proposal.status;
  self.disableConfirm = false;
  self.startProgress = false;

  self.multiline = function (arr) {
    return arr.join('<br>');
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.isAdmin = function () {
    return labsService.isAdmin();
  };

  function accept() {
    self.disableConfirm = true;
    labsService
      .createTrello(self.proposal)
      .then(function () {
        self.proposal.status = 'ACCEPTED';
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();
      }, function (data) {
        $mdToast.showSimple('Failed!' + data);
        self.disableConfirm = false;
      });
  }


  function reject() {
    var originStatus = self.proposal.status;
    self.disableConfirm = true;
    self.proposal.status = 'REJECTED';
    proposalService.update(self.proposal)
      .then(function () {
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();
      }, function (data) {
        $mdToast.showSimple('Failed!' + data);
        self.disableConfirm = false;
        self.proposal.status = originStatus;
      });
  }

  function recover() {
    self.disableConfirm = true;
    self.proposal.status = 'NEW';
    proposalService.update(self.proposal)
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
    console.log('asd');
    self.disableConfirm = true;
    if (self.proposalStatus === self.proposal.status) {
      return;
    }
    self.startProgress = true;
    if (!self.proposal.trelloCardId) {
      if (self.proposalStatus === 'REJECTED') {
        reject();
      } else if (self.proposalStatus === 'ACCEPTED') {
        accept();
      } else {
        recover();
      }
    } else {
      var originStatus = self.proposal.status;
      self.proposal.status = self.proposalStatus;
      labsService.updateTrello(self.proposal)
        .then(function () {
          self.proposal.status = self.proposalStatus;
          self.startProgress = false;
          $mdToast.showSimple('Success!');
          self.cancel();
        }, function () {
          self.disableConfirm = false;
          self.proposal.status = originStatus;
        });
    }
  };

  self.isCompletedAccept = function () {
    return self.proposal.status === 'ACCEPTED';
  };

  self.isCompletedReject = function () {
    return self.proposal.status === 'REJECTED';
  };

  self.edit = function (ev) {
    $mdDialog.show({
      controller: 'newAppDialogCtrl',
      templateUrl: 'app/nomination/proposal/app-form.html',
      parent: angular.element('body'),
      locals: {proposal: self.proposal},
      bindToController: true,
      controllerAs: 'newAppDialogCtrl',
      targetEvent: ev,
    }).then(function (proposal) {
      proposalService.update(proposal)
        .then(function () {
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]);
