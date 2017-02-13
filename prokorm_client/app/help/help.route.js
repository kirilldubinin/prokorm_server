(function() {
    'use strict';
    angular.module('help').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.help', {
                url: '/help',
                templateUrl: 'app/help/help.html',
                controller: 'HelpController',
                controllerAs: 'help',
                data: {
                    module: 'help'
                }
            });
    }
})();