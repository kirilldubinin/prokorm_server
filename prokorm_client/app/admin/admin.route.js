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
            }).state('admin.tenant', {
                url: '/:tenant_id',
                templateUrl: 'app/admin/tenant.html',
                controller: 'TenantController',
                controllerAs: 'tenant',
                params: {
                    tenant_id: undefined
                },
                data: {
                    module: 'admin'
                }
            });
    }
})();