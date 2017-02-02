(function() {
    'use strict';
    angular.module('prokorm').controller('FeedController', FeedController);

    function FeedController($scope, $window, $state, feedFactory, $mdDialog) {
        var vm = this;
        vm.filter = {
            noAnalysis: true,
            showEmpty: true
        };
        var originatorEv;
        
        feedFactory.getFeeds().then(function(result) {
            vm.filterValues = result.filterValues;
            vm.feedItems = result.feeds;
            vm.selectedItemId = $state.params.feedId;
        });

        feedFactory.getFeedDashboard().then(function(dashboard) {
            vm.dashboard = dashboard;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToHome = function() {
            vm.selectedItemId = null;
            $state.go('farm.instance.feed');
        };

        // actions
        vm.addFeed = function() {
            vm.selectedItemId = null;
            $state.go('farm.instance.feed.new');
        };
        vm.diffFeed = function() {
            vm.selectedItemId = null;
            $state.go('farm.instance.feed.diff');
        };
        vm.averageFeed = function() {
            vm.selectedItemId = null;
            $state.go('farm.instance.feed.average');
        };
        vm.sumFeed = function() {
            vm.selectedItemId = null;
            $state.go('farm.instance.feed.sum');
        };

        vm.isVisible = function (feedItem) {

            feedItem.isVisible = false;
            // by filter
            if (vm.filter) {

                // done
                if (!vm.filter.showEmpty) {
                    return !feedItem.done;
                }

                // noAnalysis
                if (!vm.filter.noAnalysis) {
                    return feedItem.analysis;
                }                

                // year            
                if (vm.filter.years && vm.filter.years.length) {
                    if (!_.includes(vm.filter.years, feedItem.year)) {
                        return false
                    }
                }
                // feedType
                if (vm.filter.feedTypes && vm.filter.feedTypes.length) {
                    if (!_.includes(vm.filter.feedTypes, feedItem.feedType)) {
                        return false
                    }
                }  
                // composition
                if (vm.filter.compositions && vm.filter.compositions.length) {
                    if (!_.includes(vm.filter.compositions, feedItem.composition)) {
                        return false
                    }
                }

                // storage
                if (vm.filter.storages && vm.filter.storages.length) {
                    if (!_.includes(vm.filter.storages, feedItem.storage)) {
                        return false
                    }
                }
            }

            //  by mode
            if (vm.isDiffMode && !feedItem.analysis) {
                return false;
            } else if (vm.isAverageMode && !feedItem.analysis) {
                return false;
            } else if (vm.isSumMode && (!feedItem.analysis || !feedItem.balanceWeight)) {
                return false;
            }

            return feedItem.isVisible = true;
        };

        vm.toggleFilter = function () {
            vm.filter.visible = !vm.filter.visible;
            vm.hiddenItemsLength = _.size(_.filter(vm.feedItems, {'isVisible': false}));
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
                vm.selectedItemId = feedItem._id;
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
                vm.selectedItemId = null;
                vm.diffFeeds = params.feeds.split(':');
            } else if (vm.isAverageMode) {
                vm.selectedItemId = null;
                vm.averageFeeds = params.feeds.split(':');
            } else if (vm.isSumMode) {
                vm.selectedItemId = null;
                vm.sumFeeds = params.feeds.split(':');
            }
            else if (newState.name === 'farm.instance.feed') {
                vm.selectedItemId = null;
                feedFactory.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            } else if (newState.name === 'farm.instance.feed.instance') {
                vm.selectedItemId = params.feedId;
                console.log(params);
                console.log(params.feedId);

            }
            
            // update list after delete or add new feed
            if (oldState.name === 'farm.instance.feed.edit' || 
                oldState.name === 'farm.instance.feed.new') {
                feedFactory.getFeeds().then(function(result) {
                    vm.feedItems = result.feeds;
                    vm.filterValues = result.filterValues;
                });
            }
        });
    }
})();