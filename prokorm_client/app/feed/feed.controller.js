(function() {
    'use strict';
    angular.module('prokorm').controller('FeedController', FeedController);

    function FeedController($scope, $window, feedHttp, $state, diff) {
        var vm = this;

        feedHttp.getFeeds().then(function(feeds) {
            vm.feedItems = feeds;
        });

        vm.inDiff = diff.inDiff;

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
        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode) {
                diff.toggleFeed(feedItem);
            } else {
                vm.selectedItem = feedItem;
                $state.go('farm.instance.feed.instance', { 'feedId': feedItem._id });
            }
        };
        vm.addFake = function () {
            feedHttp.saveFeed({
                general: {
                    name: 'Сенаж',
                    composition: 'Козлятник',
                    year: 2016,
                    weight: 2200,
                    opened: false,
                    storage: 'Курган#04',
                    field: '122.43',
                    done: false
                },
                analysis: {
                    dryMaterial: 38.00,
                    protein: 12.00,
                    digestedProtein: 44.00,
                    fat: 0.12,
                    cellulose: 2.34,
                    sugar: 11.21,
                    ash: 0.32,
                    exchangeEnergy: 12.33,
                    carotene: 34.11,
                    starch: 67.00
                },
                harvest: {
                    cutNumber: 1,
                    preservative: 'Пленка вакуумная',
                    dosage: '150гр/тонн',
                    film: 'Пленка вакуумная',
                    start: '11-06-2016',
                    end: '20-06-2016'
                },
                feeding: {
                    start: '01-11-2016',
                    end: '',
                    tonnPerDay: 2.2
                }
            });
        };

        $scope.$on('stateChangeStart', function (oldState, newState) {

        });

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.isDiffMode = newState.name === 'farm.instance.feed.diff';
            
            // update list after switch to diff mode
            if (vm.isDiffMode) {
                vm.selectedItem = null;
            } 
            // update list after delete or add new feed
            else if (newState.name === 'farm.instance.feed' || 
                        (oldState.name === 'farm.instance.feed.new' && 
                        newState.name === 'farm.instance.feed.instance')) {
                feedHttp.getFeeds().then(function(feeds) {
                    vm.feedItems = feeds;
                });
            }
        });
    }
})();