(function() {
    'use strict';
    angular.module('prokorm').controller('AverageController', AverageController);

    function AverageController($scope, feedHttp, $stateParams, _) {

    	var vm = this;
    	vm.propertiesForDiff = [];
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedHttp.diffFeeds(feedsForDiff).then(function (result) {

                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'farm.instance.feed.average') {
                updateDiffRows(params.feeds.split(':'));
            }
        });
    }
})();