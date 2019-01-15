/*global angular, window*/

angular.module('cplantApp').controller('loginCtrl', ['$http', '$mdToast', '$timeout', '$scope', '$state', function ($http, $mdToast, $timeout, $scope, $state) {
    'use strict';
    $scope.startProgress = false;
    $scope.login = function () {
        $scope.startProgress = true;
        $timeout(function () {
            $scope.displayErrorMsg = false;
        }, 3000);
        $http.post('login/auth', {kerberosid: $scope.kerberosid, password: $scope.password}).then(function (res) {
            if (!res.data.result) {
                $scope.startProgress = false;
                return $mdToast.showSimple(res.data.msg);
            }
            $state.go('main');
        });
    };
}]);
