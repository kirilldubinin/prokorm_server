(function() {
    'use strict';
    angular.module('feed').controller('DiffDemoController', DiffDemoController);
    function DiffDemoController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        feedFactory.diffDemoFeeds().then(function (result) {

            vm.dryRawValues = result.dryRawValues;
            vm.headers = result.headers;
            vm.diffRows = result.diffs;
        });
    }
})();