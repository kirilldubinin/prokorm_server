(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogController', CatalogController);

    function CatalogController($state, catalogFactory) {
    	var vm = this;
        vm.currentKey = $state.params.terms;
    	catalogFactory.getCatalog().then(function (items) {
    		vm.catalogItems = items;
    	});

    	vm.onItemClick = function (catalogItem) {
            vm.currentKey = catalogItem.key;
    		$state.go('farm.instance.catalog.instance', { 'terms': catalogItem.key });
    	};
    }
})();