(function() {
    'use strict';
    angular.module('feed').controller('FeedController', FeedController);

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
            $state.go('tenant.feed');
        };

        // actions
        vm.addFeed = function() {
            $state.go('tenant.feed.new');
        };
        vm.diffFeed = function() {
            $state.go('tenant.feed.diff');
        };
        vm.averageFeed = function() {
            $state.go('tenant.feed.average');
        };
        vm.sumFeed = function() {
            $state.go('tenant.feed.sum');
        };
        vm.planningFeed = function() {
            $state.go('tenant.feed.planning');
        };
        vm.chartsFeed = function() {
            $state.go('tenant.feed.charts');
        };
        vm.ratingFeed = function() {
            $state.go('tenant.feed.rating');
        };

        vm.isDisabled = function (feedItem) {
            if (vm.isDiffMode || vm.isAverageMode || vm.isChartMode || vm.isRatingMode) {
                return !Boolean(feedItem.analysis);
            } else if (vm.isSumMode) {
                return (!Boolean(feedItem.analysis) || !Boolean(feedItem.balanceWeight));
            }
            return false;
        };

        vm.filterByMode = false;
        function isVisible(feedItem) {

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
                    if (vm.filter.years.indexOf(feedItem.year) < 0) {
                        return false
                    }
                }
                // feedType
                if (vm.filter.feedTypes && vm.filter.feedTypes.length) {
                    if (vm.filter.feedTypes.indexOf(feedItem.feedType) < 0) {
                        return false
                    }
                }  
                // composition
                if (vm.filter.compositions && vm.filter.compositions.length) {
                    if (vm.filter.compositions.indexOf(feedItem.composition) < 0) {
                        return false
                    }
                }

                // branch
                if (vm.filter.branches && vm.filter.branches.length) {
                    if (vm.filter.branches.indexOf(feedItem.branch) < 0) {
                        return false
                    }
                }

                // storage
                if (vm.filter.storages && vm.filter.storages.length) {
                    if (vm.filter.storages.indexOf(feedItem.storage) < 0) {
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
            } else if (vm.isPlanningMode && (!feedItem.analysis || !feedItem.balanceWeight)) {
                return false;
            } else if (vm.isChartMode && !feedItem.analysis) {
                return false;
            } else if (vm.isRatingMode && !feedItem.analysis) {
                return false;
            }

            return true;
        };

        vm.clearFilter = function () {
            vm.filter = {
                noAnalysis: true,
                showEmpty: true
            };
            vm.updateVisible();
        };

        vm.toggleFilter = function () {
            vm.filterByMode = false;
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
                feed.isVisible = isVisible(feed);
            });
            vm.hiddenItemsLength = _.size(_.filter(vm.feedItems, {'isVisible': false}));
        }

        vm.selectAll = function () {
            var ids = _.map(_.filter(vm.feedItems, function (feed) {
                return feed.isVisible && !vm.isDisabled(feed);
            }), '_id');
            $state.go(vm.lastState, {
                'feeds': ids.join(':')
            });
        }

        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode || 
                vm.isAverageMode || 
                vm.isSumMode ||
                vm.isPlanningMode ||
                vm.isChartMode || 
                vm.isRatingMode) {

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
                $state.go('tenant.feed.instance', { 'feedId': feedItem._id });
            }
        };

        $scope.$on('stateChangeStart', function (oldState, newState) {

        });

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.lastState = newState.name;
            vm.isDiffMode = newState.name === 'tenant.feed.diff';
            vm.isAverageMode = newState.name === 'tenant.feed.average';
            vm.isSumMode = newState.name === 'tenant.feed.sum';
            vm.isPlanningMode = newState.name === 'tenant.feed.planning';
            vm.isChartMode = newState.name === 'tenant.feed.charts';
            vm.isRatingMode = newState.name === 'tenant.feed.rating.instance';

            vm.selectedItemId = null;
            vm.diffFeeds = null;
            vm.averageFeeds = null;
            vm.sumFeeds = null;
            vm.planningFeeds = null;
            vm.chartFeeds = null;
            vm.ratingFeeds = null;

            var paramFeeds = params.feeds ?
                params.feeds.split(':') :
                [];

            // update list after switch to diff mode
            if (vm.isDiffMode) {
                vm.selectedItemId = null;
                vm.diffFeeds = paramFeeds;
            } else if (vm.isAverageMode) {
                vm.selectedItemId = null;
                vm.averageFeeds = paramFeeds;
            } else if (vm.isSumMode) {
                vm.selectedItemId = null;
                vm.sumFeeds = paramFeeds;
            } else if (vm.isPlanningMode) {
                vm.selectedItemId = null;
                vm.planningFeeds = paramFeeds;
            } else if (vm.isChartMode) {
                vm.selectedItemId = null;
                vm.chartFeeds = paramFeeds;
            } else if (vm.isRatingMode) {
                vm.selectedItemId = null;
                vm.ratingFeeds = paramFeeds;
            }
            else if (newState.name === 'tenant.feed') {
                vm.selectedItemId = null;
                feedFactory.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            } else if (newState.name === 'tenant.feed.instance') {
                vm.selectedItemId = params.feedId;
            }
            
            // update list after delete or add new feed
            if (oldState.name === 'tenant.feed.edit' || 
                oldState.name === 'tenant.feed.new' ||
                newState.name === 'tenant.feed') {
                feedFactory.getFeeds().then(function(result) {
                    vm.feedItems = result.feeds;
                    vm.filterValues = result.filterValues;
                    vm.updateVisible();
                    vm.filterByMode = true;
                });
            } else {
                vm.updateVisible();
            }
        });
    }
})();