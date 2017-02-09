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
            vm.updateVisible();
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
            $state.go('farm.instance.feed.new');
        };
        vm.diffFeed = function() {
            $state.go('farm.instance.feed.diff');
        };
        vm.averageFeed = function() {
            $state.go('farm.instance.feed.average');
        };
        vm.sumFeed = function() {
            $state.go('farm.instance.feed.sum');
        };

        vm.chartsFeed = function() {
            $state.go('farm.instance.feed.charts');
        }

        vm.isVisible = function (feedItem) {

            //console.log(feedItem._id);

            feedItem.isVisible = false;
            // by filter
            if (vm.filter) {

                // done
                if (!vm.filter.showEmpty && feedItem.done) {
                    return false;
                }

                // noAnalysis
                if (!vm.filter.noAnalysis && !feedItem.analysis) {
                    return false;
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
            } else if (vm.isChartMode && !feedItem.analysis) {
                return false;
            }

            return feedItem.isVisible = true;
        };

        vm.toggleFilter = function () {
            if (vm.filter.visible) {
                $state.go(vm.lastState, {
                  'feeds': []
                });
                vm.updateVisible();
            }
            vm.filter.visible = !vm.filter.visible;
        };

        vm.updateVisible = function () {
            _.forEach(vm.feedItems, function (feed) {
                feed.isVisible = vm.isVisible(feed);
            });
            vm.hiddenItemsLength = _.size(_.filter(vm.feedItems, {'isVisible': false}));
        }

        vm.selectAll = function () {
            var ids = _.map(_.filter(vm.feedItems, {'isVisible': true}), '_id');
            $state.go(vm.lastState, {
                'feeds': ids.join(':')
            });
        }

        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode || vm.isAverageMode || vm.isSumMode || vm.isChartMode) {

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
            vm.isChartMode = newState.name === 'farm.instance.feed.charts';

            vm.selectedItemId = null;
            vm.diffFeeds = null;
            vm.averageFeeds = null;
            vm.sumFeeds = null;
            vm.chartFeeds = null;

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
            } else if (vm.isChartMode) {
                vm.selectedItemId = null;
                vm.chartFeeds = params.feeds.split(':');
            }
            else if (newState.name === 'farm.instance.feed') {
                vm.selectedItemId = null;
                feedFactory.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            } else if (newState.name === 'farm.instance.feed.instance') {
                vm.selectedItemId = params.feedId;
            }
            
            // update list after delete or add new feed
            if (oldState.name === 'farm.instance.feed.edit' || 
                oldState.name === 'farm.instance.feed.new' ||
                newState.name === 'farm.instance.feed') {
                feedFactory.getFeeds().then(function(result) {
                    vm.feedItems = result.feeds;
                    vm.filterValues = result.filterValues;
                    vm.updateVisible();
                });
            } else {
                vm.updateVisible();
            }
        });
    }
})();