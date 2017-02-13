(function() {
    'use strict';
    angular.module('prokorm').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('public', {
                url: '/',
                templateUrl: 'app/public/public.html',
            })
            .state('tenant', {
                url: '/:id',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'home',
                abstract: true,
                params: {
                    id: undefined
                }
            });
        $urlRouterProvider.otherwise('/');
    }
})();