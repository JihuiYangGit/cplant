angular.module('cplantApp').controller('parentCtrl', ['$scope', function ($scope) {
    'use strict';
    var self = this;

    $scope.$on("RequestsChange",function (event, data) {
        $scope.$broadcast("RequsetsChangeBroadcast", data);
    });

  }]);
  