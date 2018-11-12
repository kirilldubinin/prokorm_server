(function() {
    'use strict';
    angular.module('feed').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.feed', {
                url: '/feed',
                templateUrl: 'app/feed/list/feed.html',
                controller: 'FeedController',
                controllerAs: 'feed',
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.charts', {
                url: '/charts/:feeds',
                templateUrl: 'app/feed/charts/charts.html',
                controller: 'ChartsController',
                controllerAs: 'charts',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.diff', {
                url: '/diff/:feeds',
                templateUrl: 'app/feed/diff/diff.html',
                controller: 'DiffController',
                controllerAs: 'diff',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.sum', {
                url: '/sum/:feeds',
                templateUrl: 'app/feed/sum/sum.html',
                controller: 'SumController',
                controllerAs: 'sum',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.average', {
                url: '/average/:feeds',
                templateUrl: 'app/feed/average/average.html',
                controller: 'AverageController',
                controllerAs: 'average',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.rating', {
                url: '/rating',
                templateUrl: 'app/feed/rating/rating.html',
                controller: 'RatingController',
                controllerAs: 'rating',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.planning', {
                url: '/planning/:feeds',
                templateUrl: 'app/feed/planning/planning.html',
                controller: 'PlanningController',
                controllerAs: 'planning',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.rating.instance', {
                url: '/:feedType/:feeds',
                templateUrl: 'app/feed/rating/ratingInstance.html',
                controller: 'RatingInstanceController',
                controllerAs: 'rating',
                params: {
                    feedType: undefined,
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.new', {
                url: '/new',
                templateUrl: 'app/feed/edit/feedEdit.html',
                controller: 'FeedEditController',
                controllerAs: 'feedEdit',
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.edit', {
                url: '/:feedId/edit',
                templateUrl: 'app/feed/edit/feedEdit.html',
                controller: 'FeedEditController',
                controllerAs: 'feedEdit',
                params: {
                    feedId: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.instance', {
                url: '/:feedId',
                templateUrl: 'app/feed/view/feedView.html',
                controller: 'FeedViewController',
                controllerAs: 'feedView',
                params: {
                    feedId: undefined
                },
                data: {
                    module: 'feed'
                }
            });
    }
})();