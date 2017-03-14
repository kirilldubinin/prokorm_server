(function() {
    'use strict';
    angular.module('feed').controller('PlanningController', PlanningController);

    function PlanningController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateSum(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.sumFeeds(feedsForDiff).then(function (result) {
                vm.properties = result.properties;
                vm.sumsRows = result.sumsRows;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.sum') {
                updateSum(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();