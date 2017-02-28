(function() {
    'use strict';
    angular.module('prokorm').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('public', {
                url: '',
                templateUrl: 'app/public/public.html',
                controller: 'PublicController',
                controllerAs: 'public'
            }).state('public.view', {
                url: '/view',
                templateUrl: 'app/feed/view/feedView.html',
                controller: 'FeedViewDemoController',
                controllerAs: 'feedView'
            }).state('public.diff', {
                url: '/diff',
                templateUrl: 'app/feed/diff/diff.html',
                controller: 'DiffDemoController',
                controllerAs: 'diff'
            }).state('public.average', {
                url: '/average',
                templateUrl: 'app/feed/average/average.html',
                controller: 'AverageDemoController',
                controllerAs: 'average'
            }).state('public.sum', {
                url: '/sum',
                templateUrl: 'app/feed/sum/sum.html',
                controller: 'SumDemoController',
                controllerAs: 'sum'
            }).state('public.rating', {
                url: '/rating',
                templateUrl: 'app/feed/rating/ratingInstance.html',
                controller: 'RatingDemoController',
                controllerAs: 'rating'
            }).state('public.charts', {
                url: '/charts',
                templateUrl: 'app/feed/charts/charts.html',
                controller: 'ChartsDemoController',
                controllerAs: 'charts'
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
        //$urlRouterProvider.otherwise('/');
    }
})();