(function() {
    'use strict';
    angular.module('feed').controller('RatingController', RatingController);

    function RatingController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateRating(feeds) {

    		if (!feeds.length) {
    			vm.feeds = [];
                vm.properties = [];
    			return;
    		}

    		feedFactory.ratingFeeds(feeds).then(function (result) {
                vm.properties = result.properties;
                vm.feeds = result.feeds;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.rating') {
                updateRating(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();