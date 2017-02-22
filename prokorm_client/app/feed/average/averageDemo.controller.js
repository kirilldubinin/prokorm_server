(function() {
    'use strict';
    angular.module('feed').controller('AverageDemoController', AverageDemoController);

    function AverageDemoController(feedFactory, _) {

    	var vm = this;
    	vm.propertiesForDiff = [];
        vm._ = _;

        feedFactory.averageDemoFeeds().then(function (result) {
            vm.dryRawValues = result.dryRawValues;
            vm.headers = result.headers;
            vm.analysisRows = result.analysis;
            vm.averageRows = result.average;
        });
    }
})();