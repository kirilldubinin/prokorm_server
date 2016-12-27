(function() {
    'use strict';
    angular.module('prokorm').controller('DiffController', DiffController);

    function DiffController(feedHttp, diff, _) {
    	var vm = this;
    	vm.propertiesForDiff = [];

        // if diff.getFeeds is not empty
        updateDiffRows(diff.getFeeds());

    	diff.onChange(updateDiffRows);
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
    			return;
    		}

    		// request for diff
            var ids = _.map(feedsForDiff, function (f) {
                return f._id;
            });
    		feedHttp.diffFeeds(ids).then(function (result) {
    			vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	
    }
})();