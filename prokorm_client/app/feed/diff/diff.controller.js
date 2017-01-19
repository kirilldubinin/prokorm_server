(function() {
    'use strict';
    angular.module('prokorm').controller('DiffController', DiffController);

    function DiffController($scope, feedHttp, $stateParams, diff, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;

        // if diff.getFeeds is not empty
        updateDiffRows(diff.getFeeds());

    	diff.onChange(updateDiffRows);
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
            if (newState.name === 'farm.instance.feed.diff') {
                updateDiffRows(params.feeds.split(':'));
            }
        });
    }
})();