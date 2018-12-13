angular.module('cplantApp').controller('mainCtrl', ['labsService', function (labsService) {
  var self = this;

  self.isAdmin = labsService.isAdmin();
}]);
