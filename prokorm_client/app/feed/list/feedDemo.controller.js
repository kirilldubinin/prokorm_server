(function() {
    'use strict';
    angular.module('feed').controller('FeedDemoController', FeedDemoController);

    function FeedDemoController($scope, $window, $state, feedFactory, $mdDialog) {
        var vm = this;
        vm.filter = {
            noAnalysis: true,
            showEmpty: true
        };
        
        feedFactory.getDemoFeeds().then(function(result) {
            vm.feedItems = result.feeds;
        });

        feedFactory.getDemoFeedDashboard().then(function(dashboard) {
            vm.dashboard = dashboard;
        });
    }
})();