(function() {
    'use strict';
    RationEditController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'rationFactory', '_']
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($mdDialog, $stateParams, $state, authFactory, rationFactory, _) {
        var vm = this;

        var rationId = $stateParams.rationId;
        var promise = rationId ? 
            rationFactory.getRationEdit(rationId) : 
            rationFactory.getEmptyRation();

        promise.then(function(ration) {
            vm.rationItemSections = ration;
        });
        vm.querySearch = function(query) {
        	return rationFactory.searchFeeds(query);
        };

        vm.searchTextChange = function () {

        };
    }
})();