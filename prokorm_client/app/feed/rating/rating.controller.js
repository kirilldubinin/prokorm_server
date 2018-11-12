(function() {
    'use strict';
    angular.module('feed').controller('RatingController', RatingController);

    function RatingController($scope, $state, feedFactory, $stateParams, _) {

        var vm = this;
       
        vm.feedType = $state.params.feedType;
        vm.goToHaylage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'haylage'
            });
        };
        vm.goToSilage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'silage'
            });
        };
        vm.goToGreenMass = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'greenmass'
            });
        };	
    }
})();