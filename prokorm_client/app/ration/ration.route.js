(function() {
    'use strict';
    angular.module('ration').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.ration', {
                url: '/ration',
                templateUrl: 'app/ration/list/ration.html',
                controller: 'RationController',
                controllerAs: 'ration',
                data: {
                    module: 'ration'
                }
            }).state('tenant.ration.new', {
                url: '/new',
                templateUrl: 'app/ration/edit/rationEdit.html',
                controller: 'RationEditController',
                controllerAs: 'rationEdit',
                data: {
                    module: 'ration'
                }
            }).state('tenant.ration.edit', {
                url: '/:rationId/edit',
                templateUrl: 'app/ration/edit/rationEdit.html',
                controller: 'RationEditController',
                controllerAs: 'rationEdit',
                params: {
                    rationId: undefined
                },
                data: {
                    module: 'ration'
                }
            }).state('tenant.ration.instance', {
                url: '/:rationId',
                templateUrl: 'app/ration/view/rationView.html',
                controller: 'RationViewController',
                controllerAs: 'rationView',
                params: {
                    rationId: undefined
                },
                data: {
                    module: 'ration'
                }
            });
    }
})();