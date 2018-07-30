angular.module('cplantApp').controller('appDetailCtrl', ['$mdDialog', '$mdToast', 'proposalService', 'labsService', function ($mdDialog, $mdToast, proposalService, labsService) {
  'use strict';
  var self = this;

  self.proposal = self.locals.proposal;

  self.multiline = function (arr) {
    return arr.join('<br>');
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.isAdmin = function() {
    return labsService.isAdmin();
  };

  self.accept = function() {
    labsService.createTrello(self.proposal)
      .then(function (data) {
        $mdToast.showSimple('Success!');
      });
    self.cancel();
  };

  self.reject = function() {
    self.proposal.status = 'REJECTED';
    proposalService.update(self.proposal)
      .then(function () {
        $mdToast.showSimple('Success');
      });
    self.cancel();
  };

  self.isCompletedAccept = function() {
    return self.proposal.status === 'ACCEPTED';
  };

  self.isCompletedReject = function() {
    return self.proposal.status === 'REJECTED';
  };

  self.edit = function(ev) {
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
