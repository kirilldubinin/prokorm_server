(function() {
    'use strict';
    angular.module('prokorm').controller('SumController', SumController);

    function SumController($scope, feedHttp, $stateParams, diff, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;

        // if diff.getFeeds is not empty
        updateSum(diff.getFeeds());
    	function updateSum(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedHttp.sumFeeds(feedsForDiff).then(function (result) {
                vm.properties = result.properties;
                vm.sumsRows = result.sumsRows;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'farm.instance.feed.sum') {
                updateSum(params.feeds.split(':'));
            }
        });
    }
})();