(function() {
    'use strict';
    RationEditController.$inject = ['$mdDialog', '$stateParams', '$state', '$scope', 'feedFactory', 'rationFactory', '_']
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($mdDialog, $stateParams, $state, $scope, feedFactory, rationFactory, _) {
        var vm = this;

        vm.totalWeight = 0;
        vm.totalDryWeight = 0;
        vm.totalPrice = 0;

        var rationId = $stateParams.rationId;
        var promise = rationId ? 
            rationFactory.getRationEdit(rationId) : 
            rationFactory.getEmptyRation();

        promise.then(function(ration) {
            vm.ration = ration;
        });
        vm.querySearch = function(query) {
        	return feedFactory.searchFeeds(query);
        };

        vm.searchTextChange = function () {

        };

        vm.addFeed = function () {
            vm.ration[1].body.push([
                vm.ration[1].body.length + 1,
                '',
                0,
                0,
                0,
                0,
                0
            ]);
            //$scope.$digest();
        };
    }
})();