angular.module('cplantApp').controller('navCtrl', ['labsService', 'avatarService', function (labsService, avatarService) {
  'use strict';
  var self = this;

  self.isOpen = false;

  self.getUserName = function () {
    return labsService.getUser();
  };

  avatarService.generateAvatar(self.getUserName(), 'cplant-nav-avatar');
}]);
