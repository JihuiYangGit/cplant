/*global angular*/

angular.module('cplantApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('login', {
        templateUrl: 'app/login/login.html',
        controller: 'loginCtrl'
    });
});
