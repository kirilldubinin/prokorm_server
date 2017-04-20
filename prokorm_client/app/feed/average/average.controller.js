(function() {
    'use strict';
    angular.module('feed').controller('AverageController', AverageController);

    function AverageController($scope, $state, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateAverageRows(feedsForAverage) {

    		if (!feedsForAverage.length) {
    			vm.averageRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.averageFeeds(feedsForAverage).then(function (result) {
                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.analysisRows = result.analysis;
                vm.averageRows = result.average;
    		});
    	}	
        updateAverageRows(_.filter($state.params.feeds.split(':'), Boolean));
    }
})();