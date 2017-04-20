(function() {
    'use strict';
    angular.module('feed').factory('tonnPerDay', TonnPerDay);
    function TonnPerDay (FEED_TYPES, _) {

        var result = {};
        _.forEach(FEED_TYPES, function (feedType) {
            result[feedType.value] = 0;
        });

        return result;
    };

    angular.module('feed').controller('PlanningController', PlanningController);
    function PlanningController($scope, $state, feedFactory, $stateParams, tonnPerDay, _) {

    	var vm = this;
        vm._ = _;

        vm.tonnPerDay = tonnPerDay;

        var params = {
            feedIds: [],
            tonnPerDay: vm.tonnPerDay
        };

        var feeds = $stateParams.feeds;
    	function updatePlanning(feeds) {

    		if (!feeds.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

            params.feedIds = feeds;

    		feedFactory.planningFeeds(params).then(function (result) {
                vm.properties = result.properties;
                vm.rows = result.sumsRows;
    		});
    	}	
        var t;
        vm.onChange = function () {
            t && clearTimeout(t);
            t = setTimeout(function () {
                feedFactory.planningFeeds(params).then(function (result) {
                    vm.properties = result.properties;
                    vm.rows = result.sumsRows;
                });    
            }, 1000);
        }

        updatePlanning(_.filter($state.params.feeds.split(':'), Boolean));
    }
})();