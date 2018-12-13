/*global angular, window*/

angular.module('cplantLoginApp', ['ngMaterial', 'ngMessages']).controller('loginCtrl', ['$http', '$mdToast', '$timeout', '$scope', function ($http, $mdToast, $timeout, $scope) {
    'use strict';
    var self = this;
    self.startProgress = false;
    self.login = function () {
        self.startProgress = true;
        $timeout(function () { $scope.displayErrorMsg = false; }, 3000);
        $http.post('login/auth', {kerberosid: self.kerberosid, password: self.password}).then(function (res) {
            if (!res.data.result) {
                self.startProgress = false;
                return $mdToast.showSimple(res.data.msg);
            }
            window.location.href = '';
        });
    };
}]);
