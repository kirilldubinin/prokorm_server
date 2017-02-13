(function() {
    'use strict';
    angular.module('catalog').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.catalog', {
                url: '/catalog',
                templateUrl: 'app/catalog/catalogList/catalog.html',
                controller: 'CatalogController',
                controllerAs: 'catalog',
                data: {
                    module: 'catalog'
                }
            }).state('tenant.catalog.edit', {
                url: '/:terms/edit',
                templateUrl: 'app/catalog/catalogContentEdit/catalogContentEdit.html',
                controller: 'CatalogContentEditController',
                controllerAs: 'catalogContentEdit',
                params: {
                    terms: undefined
                },
                data: {
                    module: 'catalog'
                }
            }).state('tenant.catalog.instance', {
                url: '/:terms',
                templateUrl: 'app/catalog/catalogContent/catalogContent.html',
                controller: 'CatalogContentController',
                controllerAs: 'catalogContent',
                params: {
                    terms: undefined
                },
                data: {
                    module: 'catalog'
                }
            });
    }
})();