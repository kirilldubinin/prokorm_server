(function() {
    'use strict';

    angular.module('feed').controller('PlanningDemoController', PlanningController);
    function PlanningController($scope, $state, feedFactory, $stateParams, tonnPerDay, _) {

    	var vm = this;
        vm._ = _;
        vm.tonnPerDay = tonnPerDay;
        vm.demoMode = true;

        feedFactory.planningDemoFeeds().then(function (result) {
            vm.properties = result.properties;
            vm.rows = result.sumsRows;
            vm.tonnPerDay.haylage = 32;
        });
    }
})();