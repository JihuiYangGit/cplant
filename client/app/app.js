/*global angular*/

angular.module('cplantApp', [
    'duScroll',
    'ngCookies',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'ngAnimate',
    'ngFileUpload',
    'md.data.table'
]).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]).config(['$translateProvider', function ($translateProvider) {
    'use strict';
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/languages/messages_',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.registerAvailableLanguageKeys(['en']);
    $translateProvider.useSanitizeValueStrategy(null);
}]).filter('to_trusted', ['$sce', function ($sce) {
    'use strict';
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]).run(['$cookies', '$translate', '$transitions', '$state', function ($cookies, $translate, $transitions, $state) {
    'use strict';
    $translate.use($cookies.rh_locale);
    // Redirect to login if route requires auth and you're not logged in
    $transitions.onStart({}, function (trans) {
        var next = trans.$to();
        if (next.authenticate && !$cookies.get('red-hat-cplant-user')) {
            $state.go('login');
        }
    });
}]);
