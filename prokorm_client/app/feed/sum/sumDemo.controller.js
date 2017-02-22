(function() {
    'use strict';
    angular.module('feed').controller('SumDemoController', SumDemoController);

    function SumDemoController(feedFactory, _) {

    	var vm = this;
        vm._ = _;

        feedFactory.sumDemoFeeds().then(function (result) {
            vm.properties = result.properties;
            vm.sumsRows = result.sumsRows;
        });
    }
})();