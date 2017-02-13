(function() {
    'use strict';
    angular.module('info').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.info', {
                url: '/info',
                templateUrl: 'app/info/info.html',
                controller: 'InfoController',
                controllerAs: 'info',
                data: {
                    module: 'info'
                }
            });
    }
})();