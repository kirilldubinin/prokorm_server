(function() {
    'use strict';
    angular.module('feed').controller('RatingDemoController', RatingDemoController);

    function RatingDemoController($scope, feedFactory, $state, $stateParams, _) {

    	var vm = this;
    	feedFactory.ratingDemoFeeds().then(function (result) {
            vm.properties = result.properties;
            vm.feeds = result.feeds;
        });
    }
})();