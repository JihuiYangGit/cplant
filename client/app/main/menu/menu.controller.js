angular.module('cplantApp').controller('menuCtrl', ['labsService','$mdDialog','$mdToast', function (labsService,$mdDialog,$mdToast) {
    'use strict';
    var self = this;

    self.signOut = function () {
        labsService.signOut();
    };
  
    self.addAdmin = function(ev) {
        $mdDialog.show({
            controller: 'menuDialogCtrl',
            contentElement: '#newAdminDialog',
            parent: angular.element('body'),
            targetEvent: ev,
          }).then(function (admin) {
              labsService.addAdmin(admin)
              .then(function () {
                $mdToast.show($mdToast.simple()
                  .textContent('Success!')
                  .position('bottom left')
                  .hideDelay(1500));
              });
          })
          .catch(function(err) {
            console.log(err);
          });
    };

    self.listAdmin = function (ev) {
      $mdDialog.show({
        controller: 'menuDialogCtrl',
        templateUrl: 'app/main/menu/list-admin-form.html',
        parent: angular.element('body'),
        targetEvent: ev,
      })
      .catch(function(err) {
        console.log(err);
      });
    };

}]).controller('menuDialogCtrl', ['$mdDialog','$scope','labsService', function ($mdDialog,$scope,labsService) {
  'use strict';
  var self = this;
  self.startProgress = false;
  function init() {   

    labsService.listAdmin().then(function(data){
        $scope.adminlist = data;
    }).catch(function(err){
        console.log(err);
    });

    self.admin = {
      name: '',
      kerberosid: '',
      email: ''
    };
  }

  init();

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (adminForm) {
    self.startProgress = true;
    if (adminForm.$valid) {
      self.startProgress = false;
      $mdDialog.hide(self.admin).then(function () {
        self.reset(adminForm);
      });
    }
    self.startProgress = false;
  };

  self.reset = function (adminForm) {
    adminForm.$setPristine();
    init();
  };
}]);

  