angular.module('cplantApp').controller('appCtrl', ['labsService', function (labsService) {
  var self = this;

  self.isAdmin = labsService.isAdmin();
}]);
