/*global angular*/

angular.module('cplantApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main', {
        templateUrl: 'app/main/main.html',
        controller: 'mainCtrl'
    });
});
