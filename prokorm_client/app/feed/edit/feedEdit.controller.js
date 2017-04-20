(function() {
    'use strict';
    angular.module('feed').controller('FeedEditController', FeedEdiController);
    /** @ngInject */
    function FeedEdiController($window, $stateParams, $state, $scope, feedFactory, FEED_TYPES, STORAGE_TYPES) {
        var vm = this;

        vm.feedItem = {
            analysis: []
        };

        vm.feedTypes = FEED_TYPES;
        vm.storageTypes = STORAGE_TYPES;

        vm.feedItemControls = [];
        var feedId = $stateParams.feedId;
        var promise = feedId ? feedFactory.getFeedEdit(feedId) : feedFactory.getEmptyFeed();
        promise.then(function(feed) {
            vm.feedItemSections = feed;
            //set analysis list
            vm.feedItem.analysis = _.map(feed[0].subSections, function(subSection) {
                return subSection.initialItem;
            });
        });

        vm.deleteCurrentAnalysis = function () {
            vm.feedItemSections[0].subSections = _.filter(vm.feedItemSections[0].subSections, 
                function (sebSection) {
                    return sebSection.initialItem !== vm.currentAnalysis;
                });

            //set analysis list
            vm.feedItem.analysis = _.map(vm.feedItemSections[0].subSections, function(subSection) {
                return subSection.initialItem;
            });
        };

        vm.onAnalysisAdd = function() {

            feedFactory.getEmptyAnalysis().then(function (newAnalysis) {
                // if no any analysis
                if (vm.feedItem.analysis && vm.feedItem.analysis.length) {
                    var max = _.max(_.map(vm.feedItem.analysis, 'number'));
                    newAnalysis.initialItem.number = max + 1;
                    vm.feedItem.analysis.push(newAnalysis);
                }

                vm.feedItemSections[0].subSections.push(newAnalysis);
                //set analysis list
                vm.feedItem.analysis = _.map(vm.feedItemSections[0].subSections, function(subSection) {
                    return subSection.initialItem;
                });
            });
        };
        vm.onAnalysisSelect = function(item) {
            vm.currentAnalysis = item;
        };
        vm.save = function() {

            var feed = {
                analysis: _.map(vm.feedItemSections[0].subSections, function (subSection) {
                    return subSection.initialItem;
                }),
                general: vm.feedItemSections[1].subSections[0].initialItem,
                harvest: vm.feedItemSections[2].subSections[0].initialItem,
                feeding: vm.feedItemSections[3].subSections[0].initialItem
            };

            if (feedId) {
                feed._id = feedId;
            }

            feedFactory.saveFeed(feed).then(function(response) {
                if (response.message === 'OK') {
                    $state.go('tenant.feed.instance', {
                        'feedId': response.id
                    });
                }
            });
        };
        vm.cancel = function() {
            if (feedId) {
                $state.go('tenant.feed.instance', {
                    'feedId': feedId
                });    
            } else {
                $state.go('tenant.feed'); 
            }
        };
        vm.onSelfExplanationLinkClick = function(key) {
            $state.go('farm.help', {
                'key': key
            });
        };
    }
})();