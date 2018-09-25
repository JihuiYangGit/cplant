angular.module('cplantApp').controller('appDetailCtrl', ['$mdDialog', '$mdToast', 'proposalService', 'labsService','$http', function ($mdDialog, $mdToast, proposalService, labsService, $http) {
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
      .then(function (data) {
        self.proposal.status = 'ACCEPTED';
        self.startProgress = false;
        $mdToast.showSimple('Success!');
        self.cancel();

        if(data.result) {
          self.report.trelloCardId = data.trelloCardId;
        }
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
    //console.log('asd');
    self.mailText = 'Contact jihyang@redhat.com for more information.'
    var maildata = {address: self.proposal.requiredQuestions.contacts[0], subject: 'Your proposal has been '+ self.proposalStatus, text: self.mailText};
    self.disableConfirm = true;

    if (self.proposalStatus === self.proposal.status) {
      return;
    }
    self.startProgress = true;
    if (!self.proposal.trelloCardId ) {
      if (self.proposalStatus === 'REJECTED') {
        reject();
        proposalService.mailto(maildata)
        .then(function(response){
          console.log('Email has sent');
        },function(response){
          console.log('Email sent with err');
        })
      } else if (self.proposalStatus === 'ACCEPTED') {
        accept();
        proposalService.mailto(maildata)
        .then(function(response){
          console.log('Email has sent');
        },function(response){
          console.log('Email sent with err');
        })
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
          //maildata.status = self.proposal.status;
          proposalService.mailto(maildata)
          .then(function(response){
            console.log('Email has sent');
          },function(response){
            console.log('Email sent with err');
          })
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
