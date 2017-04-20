(function() {
    'use strict';
    angular.module('feed').controller('DiffController', DiffController);

    function DiffController($scope, $state, feedFactory, $stateParams, _) {

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

        updateDiffRows(_.filter($state.params.feeds.split(':'), Boolean));
    }
})();