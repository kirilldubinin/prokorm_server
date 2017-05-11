(function() {
    'use strict';
    RationEditController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'feedFactory', '_']
    angular.module('ration').controller('RationEditController', RationEditController);

    function RationEditController($mdDialog, $stateParams, $state, authFactory, rationFactory, _) {
        var vm = this;
        vm.items = [{
            name: '1',
            year: 2015,
            feedType: 'haylage',
            composition: 'foo',
            balanceWeight: 1
        }, {
            name: '1',
            year: 2015,
            feedType: 'haylage',
            composition: 'foo',
            balanceWeight: 1
        }];
        vm.querySearch = function(query) {
        	return rationFactory.searchFeeds(query);
        };

        vm.searchTextChange = function () {

        };
    }
})();