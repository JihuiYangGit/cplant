/*global angular*/

angular.module('cplantApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('login', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'loginCtrl'
    });
});
