angular.module('cplantApp').controller('appDetailCtrl', ['$mdDialog', '$mdToast', 'proposalService', function ($mdDialog, $mdToast, proposalService) {
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
