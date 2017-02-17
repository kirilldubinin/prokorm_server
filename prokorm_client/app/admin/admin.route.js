(function() {
    'use strict';
    angular.module('admin').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'admin',
                data: {
                    module: 'admin'
                }
            });
    }
})();