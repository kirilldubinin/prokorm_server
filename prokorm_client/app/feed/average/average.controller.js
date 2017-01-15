(function() {
    'use strict';
    angular.module('prokorm').controller('AverageController', AverageController);

    function AverageController($scope, feedHttp, $stateParams, _) {

    	var vm = this;
    	vm.propertiesForDiff = [];
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateAverageRows(feedsForAverage) {

    		if (!feedsForAverage.length) {
    			vm.averageRows = [];
                vm.headers = [];
    			return;
    		}

    		feedHttp.averageFeeds(feedsForAverage).then(function (result) {
                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.analysisRows = result.analysis;
                vm.averageRows = result.average;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'farm.instance.feed.average') {
                updateAverageRows(params.feeds.split(':'));
            }
        });
    }
})();