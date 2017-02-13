(function() {
    'use strict';
    angular.module('feed').controller('AverageController', AverageController);

    function AverageController($scope, feedFactory, $stateParams, _) {

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

    		feedFactory.averageFeeds(feedsForAverage).then(function (result) {
                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.analysisRows = result.analysis;
                vm.averageRows = result.average;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.average') {
                updateAverageRows(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();