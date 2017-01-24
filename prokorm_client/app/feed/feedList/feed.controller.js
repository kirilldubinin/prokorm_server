(function() {
    'use strict';
    angular.module('prokorm').controller('FeedController', FeedController);

    function FeedController($scope, $window, feedFactory, $state, $mdDialog) {
        var vm = this;
        var originatorEv;
        
        feedFactory.getFeeds().then(function(feeds) {
            vm.feedItems = feeds;
        });

        feedFactory.getFeedDashboard().then(function(dashboard) {
            vm.dashboard = dashboard;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.goToAdd = function() {
            vm.selectedItem = null;
            $state.go('farm.instance.feed.new');
        };
        vm.goToHome = function() {
            vm.selectedItem = null;
            $state.go('farm.instance.feed');
        };
        vm.goToDiff = function() {
            vm.selectedItem = null;
            $state.go('farm.instance.feed.diff');
        };
        vm.goToAverage = function() {
            vm.selectedItem = null;
            $state.go('farm.instance.feed.average');
        };
        vm.goToSum = function() {
            vm.selectedItem = null;
            $state.go('farm.instance.feed.sum');
        };

        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode || vm.isAverageMode || vm.isSumMode) {

                var currentFeeds = _.filter($state.params.feeds.split(':'), function (o) { return o; });
                var ind = currentFeeds.indexOf(feedItem._id);

                if (ind > -1) {
                    currentFeeds.splice(ind, 1);
                } else {
                    currentFeeds.push(feedItem._id);
                }

                $state.go(vm.lastState, {
                  'feeds': currentFeeds.join(':')
                });
            } else {
                vm.selectedItem = feedItem;
                $state.go('farm.instance.feed.instance', { 'feedId': feedItem._id });
            }
        };

        $scope.$on('stateChangeStart', function (oldState, newState) {

        });

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.lastState = newState.name;
            vm.isDiffMode = newState.name === 'farm.instance.feed.diff';
            vm.isAverageMode = newState.name === 'farm.instance.feed.average';
            vm.isSumMode = newState.name === 'farm.instance.feed.sum';

            vm.diffFeeds = null;
            vm.averageFeeds = null;
            vm.sumFeeds = null;

            // update list after switch to diff mode
            if (vm.isDiffMode) {
                vm.selectedItem = null;
                vm.diffFeeds = params.feeds.split(':');
            } else if (vm.isAverageMode) {
                vm.selectedItem = null;
                vm.averageFeeds = params.feeds.split(':');
            } else if (vm.isSumMode) {
                vm.selectedItem = null;
                vm.sumFeeds = params.feeds.split(':');
            }
            else if (newState.name === 'farm.instance.feed') {
                feedFactory.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            }
            // update list after delete or add new feed
            else if (newState.name === 'farm.instance.feed' || oldState.name === 'farm.instance.feed.edit' || 
                        (oldState.name === 'farm.instance.feed.new' && 
                        newState.name === 'farm.instance.feed.instance')) {
                feedFactory.getFeeds().then(function(feeds) {
                    vm.feedItems = feeds;
                });
            }
        });
    }
})();