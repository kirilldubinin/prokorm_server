(function() {
    'use strict';
    angular.module('prokorm').controller('DiffController', DiffController);

    function DiffController(feedHttp, diff, _) {

    	var vm = this;
    	vm.propertiesForDiff = [];
        vm._ = _;

        // if diff.getFeeds is not empty
        updateDiffRows(diff.getFeeds());

    	diff.onChange(updateDiffRows);
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		// request for diff
            var ids = _.map(feedsForDiff, function (f) {
                return f._id;
            });
    		feedHttp.diffFeeds(ids).then(function (result) {

                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	
    }
})();