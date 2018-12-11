angular.module('cplantApp').controller('newAppCtrl', ['$scope', '$mdDialog', '$mdToast', 'proposalService', function ($scope,$mdDialog, $mdToast, proposalService) {
  'use strict';
  var self = this;

  self.create = function (ev) {

    $mdDialog.show({
      controller: 'newAppDialogCtrl',
      contentElement: '#newAppDialog',
      parent: angular.element('body'),
      targetEvent: ev,
      clickOutsideToClose: false,
    }).then(function (proposal) {
      if (!proposal) {
        return;
      }
      proposalService.create(proposal)
        .then(function (data) {
          $scope.$emit("RequestsChange", data);
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });

    }, function () {

    });
  };


}]).controller('newAppDialogCtrl', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
  'use strict';
  var self = this;

  var products = ['Red Hat Enterprise Linux',
    'JBoss',
    'Red Hat Virtualization',
    'Cloud',
    'Mobile'];

  var sbrs = ['Kernel',
    'Networking',
    'Storage',
    'Virtulualization',
    'JBoss Base AS',
    'Ceph',
    'Stack'
  ];

  var caseFrequencies = ['1000+',
    '500 - 1000',
    '100 - 500',
    '50 - 100',
    '0 - 50'];

  var targetUsers = ['Customers', 'Support Delivery / Strategic Customer Engagement teams'];

  self.targetUserSelectIndex = [true, false, false];
  self.otherProduct = '';
  self.otherSbr = '';
  self.otherTargetUser = '';
  self.otherCaseFrequency = '';
  self.startProgress = false;

  function calculateTargetUser() {
    self.proposal.requiredQuestions.targetUser = self.targetUserSelectIndex.map(function (value, index) {
      self.proposal.requiredQuestions.targetUser = [];

      if (value) {
        if (index < 2 && index >= 0) {
          return targetUsers[index];
        }
        if (index === 2) {
          return self.otherTargetUser;
        }
      }
    }).filter(function (value) {
      return value;
    });
  }

  function init() {
    if (self.locals && self.locals.proposal) {
      self.proposal = Object.assign({}, self.locals.proposal);

      self.proposal.optionalQuestions = self.proposal.optionalQuestions || {};

      if (self.proposal.requiredQuestions.product && products.indexOf(self.proposal.requiredQuestions.product) === -1) {
        self.otherProduct = self.proposal.requiredQuestions.product;
      }

      if (self.proposal.requiredQuestions.sbr && sbrs.indexOf(self.proposal.requiredQuestions.sbr) === -1) {
        self.otherSbr = self.proposal.requiredQuestions.sbr;
      }

      if (self.proposal.requiredQuestions.targetUser) {
        self.targetUserSelectIndex[0] = self.proposal.requiredQuestions.targetUser.indexOf(targetUsers[0]) !== -1;
        self.targetUserSelectIndex[1] = self.proposal.requiredQuestions.targetUser.indexOf(targetUsers[1]) !== -1;

        var other = self.proposal.requiredQuestions.targetUser.filter(function(value) {return targetUsers.indexOf(value) === -1} );
        if (other.length !== 0) {
          self.targetUserSelectIndex[2] = false;
          self.otherTargetUser = other[0];
        }
      }

      if (self.proposal.optionalQuestions.caseFrequency && caseFrequencies.indexOf(self.proposal.optionalQuestions.caseFrequency) !== -1) {
        self.otherCaseFrequency = self.proposal.optionalQuestions.caseFrequency;
      }
    } else {
      self.proposal = {
        requiredQuestions: {
          product: 'Red Hat Enterprise Linux',
          sbr: 'Kernel',
          targetUser: ['Customers']
        }
      };
    }
  }

  init();

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (proposalForm) {
    self.startProgress = true;
    
      if (proposalForm.$valid) {
        self.startProgress = false;
        $mdDialog.hide(self.proposal).then(function () {
          self.reset(proposalForm);
        });
      }
      self.startProgress = false;
  };

  self.targetUsersCheckBoxClick = function (index) {
    self.targetUserSelectIndex[index] = !self.targetUserSelectIndex[index];
    calculateTargetUser();
  };

  self.otherTargetUserClick = function (ev) {
    ev.stopPropagation();
  };

  self.otherTargetUserChange = function (ev) {
    calculateTargetUser();
  };

  self.reset = function (proposalForm) {
    proposalForm.$setPristine();
    init();
  };
}]);

