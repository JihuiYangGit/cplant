angular.module('cplantApp').controller('mainCtrl', ['labsService', function (labsService) {
  'use strict';
  var self = this;

  self.isAdmin = labsService.isAdmin();
}]);
