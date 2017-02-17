(function() {
    'use strict';
    angular.module('catalog').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.catalog', {
                url: '/catalog',
                templateUrl: 'app/catalog/list/catalog.html',
                controller: 'CatalogController',
                controllerAs: 'catalog',
                data: {
                    module: 'catalog'
                }
            }).state('tenant.catalog.edit', {
                url: '/:terms/edit',
                templateUrl: 'app/catalog/contentEdit/catalogContentEdit.html',
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
                templateUrl: 'app/catalog/content/catalogContent.html',
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