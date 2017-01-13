(function() {
    'use strict';
    angular.module('prokorm').controller('FeedController', FeedController);

    function FeedController($scope, $window, feedHttp, $state, $mdDialog, diff) {
        var vm = this;
        var originatorEv;
        
        feedHttp.getFeeds().then(function(feeds) {
            vm.feedItems = feeds;
        });

        feedHttp.getFeedDashboard().then(function(dashboard) {
            vm.dashboard = dashboard;
        });

        vm.inDiff = diff.inDiff;

        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.goToAdd = function() {
            vm.selectedItem = null;
            diff.clear();
            $state.go('farm.instance.feed.new');
        };
        vm.goToHome = function() {
            vm.selectedItem = null;
            diff.clear();
            $state.go('farm.instance.feed');
        };
        vm.goToDiff = function() {
            vm.selectedItem = null;
            diff.clear();
            $state.go('farm.instance.feed.diff');
        };
        vm.goTAverage = function() {
            vm.selectedItem = null;
            diff.clear();
            $state.go('farm.instance.feed.average');
        };

        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode) {

                var currentFeeds = _.filter($state.params.feeds.split(':'), function (o) { return o; });
                var ind = currentFeeds.indexOf(feedItem._id);

                if (ind > -1) {
                    currentFeeds.splice(ind, 1);
                } else {
                    currentFeeds.push(feedItem._id);
                }

                $state.go('farm.instance.feed.diff', {
                  'feeds': currentFeeds.join(':')
                });
                //diff.toggleFeed(feedItem);
            } else {
                vm.selectedItem = feedItem;
                $state.go('farm.instance.feed.instance', { 'feedId': feedItem._id });
            }
        };

        $scope.$on('stateChangeStart', function (oldState, newState) {

        });

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.isDiffMode = newState.name === 'farm.instance.feed.diff';
            
            // update list after switch to diff mode
            if (vm.isDiffMode) {
                vm.selectedItem = null;
                vm.diffFeeds = params.feeds.split(':');
            } 
            else if (newState.name === 'farm.instance.feed') {
                feedHttp.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            }
            // update list after delete or add new feed
            else if (newState.name === 'farm.instance.feed' || oldState.name === 'farm.instance.feed.edit' || 
                        (oldState.name === 'farm.instance.feed.new' && 
                        newState.name === 'farm.instance.feed.instance')) {
                vm.diffFeeds = null;
                feedHttp.getFeeds().then(function(feeds) {
                    vm.feedItems = feeds;
                });
            }
        });
    }
})();