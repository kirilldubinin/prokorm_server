(function() {
    'use strict';
    angular.module('feed').controller('SumController', SumController);

    function SumController($scope, $state, feedFactory, $stateParams, _) {

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

        updateSum(_.filter($state.params.feeds.split(':'), Boolean));
    }
})();