(function() {
    'use strict';
    angular.module('prokorm').controller('DiffController', DiffController);

    function DiffController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.diffFeeds(feedsForDiff).then(function (result) {

                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'farm.instance.feed.diff') {
                updateDiffRows(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();